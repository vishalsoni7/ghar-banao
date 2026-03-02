import express from 'express';
import Vendor from '../models/Vendor.js';
import Purchase from '../models/Purchase.js';
import Payment from '../models/Payment.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all vendors
router.get('/', auth, async (req, res) => {
  try {
    const vendors = await Vendor.find({ userId: req.userId }).sort({ name: 1 });

    // Get purchase stats for each vendor
    const vendorsWithStats = await Promise.all(vendors.map(async (vendor) => {
      const purchases = await Purchase.find({ userId: req.userId, vendorId: vendor._id });
      const totalAmount = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
      const totalPaid = purchases.reduce((sum, p) => sum + p.amountPaid, 0);
      const pendingAmount = totalAmount - totalPaid;

      return {
        ...vendor.toObject(),
        totalAmount,
        totalPaid,
        pendingAmount,
        purchaseCount: purchases.length
      };
    }));

    res.json(vendorsWithStats);
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new vendor
router.post('/', auth, async (req, res) => {
  try {
    const { name, phone, address, category, notes } = req.body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ message: 'Vendor name is required (minimum 2 characters)' });
    }

    if (!category || typeof category !== 'string' || category.trim().length === 0) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const vendor = new Vendor({
      userId: req.userId,
      name: name.trim(),
      phone: phone?.trim() || '',
      address: address?.trim() || '',
      category: category.trim(),
      notes: notes?.trim() || ''
    });
    await vendor.save();

    res.status(201).json({
      message: 'Vendor added successfully',
      vendor: {
        ...vendor.toObject(),
        totalAmount: 0,
        totalPaid: 0,
        pendingAmount: 0,
        purchaseCount: 0
      }
    });
  } catch (error) {
    console.error('Add vendor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get vendor by ID with purchase history
router.get('/:id', auth, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ _id: req.params.id, userId: req.userId });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const purchases = await Purchase.find({ userId: req.userId, vendorId: vendor._id })
      .sort({ date: -1 });

    const payments = await Payment.find({ userId: req.userId, vendorId: vendor._id })
      .sort({ date: -1 });

    const totalAmount = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
    const totalPaid = purchases.reduce((sum, p) => sum + p.amountPaid, 0);

    res.json({
      vendor: {
        ...vendor.toObject(),
        totalAmount,
        totalPaid,
        pendingAmount: totalAmount - totalPaid,
        purchaseCount: purchases.length
      },
      purchases,
      payments
    });
  } catch (error) {
    console.error('Get vendor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update vendor
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, phone, address, category, notes } = req.body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ message: 'Vendor name is required (minimum 2 characters)' });
    }

    if (!category || typeof category !== 'string' || category.trim().length === 0) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const vendor = await Vendor.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        name: name.trim(),
        phone: phone?.trim() || '',
        address: address?.trim() || '',
        category: category.trim(),
        notes: notes?.trim() || ''
      },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({ message: 'Vendor updated', vendor });
  } catch (error) {
    console.error('Update vendor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete vendor
router.delete('/:id', auth, async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({ message: 'Vendor deleted' });
  } catch (error) {
    console.error('Delete vendor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
