import express from 'express';
import Payment from '../models/Payment.js';
import Purchase from '../models/Purchase.js';
import Vendor from '../models/Vendor.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all payments
router.get('/', auth, async (req, res) => {
  try {
    const { vendorId, startDate, endDate, paymentMode } = req.query;

    const filter = { userId: req.userId };

    if (vendorId) filter.vendorId = vendorId;
    if (paymentMode) filter.paymentMode = paymentMode;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const payments = await Payment.find(filter)
      .populate('vendorId', 'name phone')
      .populate('purchaseId', 'billNumber totalAmount')
      .sort({ date: -1 });

    res.json(payments);
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new payment
router.post('/', auth, async (req, res) => {
  try {
    const { purchaseId, vendorId, vendorName, amount, date, paymentMode, reference, notes } = req.body;

    // Validation
    if (!vendorId) {
      return res.status(400).json({ message: 'Vendor is required' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const validModes = ['cash', 'upi', 'bank', 'cheque'];
    if (paymentMode && !validModes.includes(paymentMode)) {
      return res.status(400).json({ message: 'Invalid payment mode' });
    }

    // Get vendor name if vendorId provided
    let finalVendorName = vendorName;
    if (vendorId) {
      const vendor = await Vendor.findById(vendorId);
      if (!vendor) {
        return res.status(400).json({ message: 'Vendor not found' });
      }
      finalVendorName = vendor.name;
    }

    const payment = new Payment({
      userId: req.userId,
      purchaseId: purchaseId || null,
      vendorId: vendorId,
      vendorName: finalVendorName?.trim() || '',
      amount: parsedAmount,
      date: date ? new Date(date) : new Date(),
      paymentMode: paymentMode || 'cash',
      reference: reference?.trim() || '',
      notes: notes?.trim() || ''
    });
    await payment.save();

    // If linked to a purchase, update the purchase's amountPaid
    if (purchaseId) {
      const purchase = await Purchase.findById(purchaseId);
      if (purchase) {
        purchase.amountPaid = (purchase.amountPaid || 0) + parseFloat(amount);

        // Update payment status
        if (purchase.amountPaid >= purchase.totalAmount) {
          purchase.paymentStatus = 'paid';
        } else if (purchase.amountPaid > 0) {
          purchase.paymentStatus = 'partial';
        }

        await purchase.save();
      }
    }

    const populatedPayment = await Payment.findById(payment._id)
      .populate('vendorId', 'name phone')
      .populate('purchaseId', 'billNumber totalAmount');

    res.status(201).json({
      message: 'Payment recorded successfully',
      payment: populatedPayment
    });
  } catch (error) {
    console.error('Add payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, userId: req.userId })
      .populate('vendorId', 'name phone')
      .populate('purchaseId', 'billNumber totalAmount date');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete payment
router.delete('/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, userId: req.userId });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // If linked to a purchase, update the purchase's amountPaid
    if (payment.purchaseId) {
      const purchase = await Purchase.findById(payment.purchaseId);
      if (purchase) {
        purchase.amountPaid = Math.max(0, (purchase.amountPaid || 0) - payment.amount);

        // Update payment status
        if (purchase.amountPaid >= purchase.totalAmount) {
          purchase.paymentStatus = 'paid';
        } else if (purchase.amountPaid > 0) {
          purchase.paymentStatus = 'partial';
        } else {
          purchase.paymentStatus = 'pending';
        }

        await purchase.save();
      }
    }

    await payment.deleteOne();
    res.json({ message: 'Payment deleted' });
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
