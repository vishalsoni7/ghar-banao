import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Purchase from '../models/Purchase.js';
import Vendor from '../models/Vendor.js';
import auth from '../middleware/auth.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer config for bill photo upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'bill-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Get all purchases
router.get('/', auth, async (req, res) => {
  try {
    const { vendorId, category, status, startDate, endDate, search } = req.query;

    const filter = { userId: req.userId };

    if (vendorId) filter.vendorId = vendorId;
    if (status) filter.paymentStatus = status;
    if (category) filter['items.category'] = category;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (search) {
      filter.$or = [
        { vendorName: { $regex: search, $options: 'i' } },
        { 'items.name': { $regex: search, $options: 'i' } },
        { billNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const purchases = await Purchase.find(filter)
      .populate('vendorId', 'name phone')
      .sort({ date: -1 });

    res.json(purchases);
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new purchase
router.post('/', auth, upload.single('billPhoto'), async (req, res) => {
  try {
    const { vendorId, vendorName, date, items, totalAmount, billNumber, paymentStatus, amountPaid, notes } = req.body;

    // Parse items if it's a string
    let parsedItems;
    try {
      parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
    } catch (e) {
      return res.status(400).json({ message: 'Invalid items format' });
    }

    // Validation
    if (!vendorId && !vendorName) {
      return res.status(400).json({ message: 'Vendor is required' });
    }

    if (!parsedItems || !Array.isArray(parsedItems) || parsedItems.length === 0) {
      return res.status(400).json({ message: 'At least one item is required' });
    }

    // Validate each item - category is required, name is optional
    for (let i = 0; i < parsedItems.length; i++) {
      const item = parsedItems[i];
      if (!item.category || item.category.trim().length === 0) {
        return res.status(400).json({ message: `Item ${i + 1}: Category is required` });
      }
      if (!item.quantity || parseFloat(item.quantity) <= 0) {
        return res.status(400).json({ message: `Item ${i + 1}: Quantity must be greater than 0` });
      }
      if (item.rate === undefined || item.rate === null || parseFloat(item.rate) < 0) {
        return res.status(400).json({ message: `Item ${i + 1}: Rate is required` });
      }
    }

    const parsedTotalAmount = parseFloat(totalAmount);
    if (isNaN(parsedTotalAmount) || parsedTotalAmount < 0) {
      return res.status(400).json({ message: 'Invalid total amount' });
    }

    // Get vendor name if vendorId provided
    let finalVendorName = vendorName;
    if (vendorId) {
      const vendor = await Vendor.findById(vendorId);
      if (vendor) finalVendorName = vendor.name;
    }

    const purchase = new Purchase({
      userId: req.userId,
      vendorId: vendorId || null,
      vendorName: finalVendorName?.trim() || '',
      date: date ? new Date(date) : new Date(),
      items: parsedItems.map(item => ({
        name: item.name?.trim() || '',
        category: item.category.trim(),
        quantity: parseFloat(item.quantity),
        unit: item.unit || 'piece',
        rate: parseFloat(item.rate),
        amount: parseFloat(item.amount) || parseFloat(item.quantity) * parseFloat(item.rate)
      })),
      totalAmount: parsedTotalAmount,
      billPhoto: req.file ? `/uploads/${req.file.filename}` : null,
      billNumber: billNumber?.trim() || '',
      paymentStatus: paymentStatus || 'pending',
      amountPaid: parseFloat(amountPaid) || 0,
      notes: notes?.trim() || ''
    });
    await purchase.save();

    const populatedPurchase = await Purchase.findById(purchase._id)
      .populate('vendorId', 'name phone');

    res.status(201).json({
      message: 'Purchase added successfully',
      purchase: populatedPurchase
    });
  } catch (error) {
    console.error('Add purchase error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get purchase by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const purchase = await Purchase.findOne({ _id: req.params.id, userId: req.userId })
      .populate('vendorId', 'name phone address');

    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    res.json(purchase);
  } catch (error) {
    console.error('Get purchase error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update purchase
router.put('/:id', auth, upload.single('billPhoto'), async (req, res) => {
  try {
    const { vendorId, vendorName, date, items, totalAmount, billNumber, paymentStatus, amountPaid, notes } = req.body;

    // Parse items
    let parsedItems;
    try {
      parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
    } catch (e) {
      return res.status(400).json({ message: 'Invalid items format' });
    }

    // Validation
    if (!vendorId && !vendorName) {
      return res.status(400).json({ message: 'Vendor is required' });
    }

    if (!parsedItems || !Array.isArray(parsedItems) || parsedItems.length === 0) {
      return res.status(400).json({ message: 'At least one item is required' });
    }

    // Validate each item - category is required, name is optional
    for (let i = 0; i < parsedItems.length; i++) {
      const item = parsedItems[i];
      if (!item.category || item.category.trim().length === 0) {
        return res.status(400).json({ message: `Item ${i + 1}: Category is required` });
      }
      if (!item.quantity || parseFloat(item.quantity) <= 0) {
        return res.status(400).json({ message: `Item ${i + 1}: Quantity must be greater than 0` });
      }
    }

    const updateData = {
      vendorId: vendorId || null,
      vendorName: vendorName?.trim() || '',
      date: date ? new Date(date) : undefined,
      items: parsedItems.map(item => ({
        name: item.name?.trim() || '',
        category: item.category.trim(),
        quantity: parseFloat(item.quantity),
        unit: item.unit || 'piece',
        rate: parseFloat(item.rate),
        amount: parseFloat(item.amount) || parseFloat(item.quantity) * parseFloat(item.rate)
      })),
      totalAmount: parseFloat(totalAmount),
      billNumber: billNumber?.trim() || '',
      paymentStatus,
      amountPaid: parseFloat(amountPaid) || 0,
      notes: notes?.trim() || ''
    };

    if (req.file) {
      updateData.billPhoto = `/uploads/${req.file.filename}`;
    }

    const purchase = await Purchase.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updateData,
      { new: true }
    ).populate('vendorId', 'name phone');

    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    res.json({ message: 'Purchase updated', purchase });
  } catch (error) {
    console.error('Update purchase error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete purchase
router.delete('/:id', auth, async (req, res) => {
  try {
    const purchase = await Purchase.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    res.json({ message: 'Purchase deleted' });
  } catch (error) {
    console.error('Delete purchase error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
