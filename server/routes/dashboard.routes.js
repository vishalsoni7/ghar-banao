import express from 'express';
import Purchase from '../models/Purchase.js';
import Vendor from '../models/Vendor.js';
import Payment from '../models/Payment.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

// Get dashboard summary
router.get('/summary', auth, async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: req.userId });
    const vendors = await Vendor.find({ userId: req.userId });
    const payments = await Payment.find({ userId: req.userId });

    const totalAmount = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
    const totalPaid = purchases.reduce((sum, p) => sum + p.amountPaid, 0);
    const pendingAmount = totalAmount - totalPaid;

    const pendingPurchases = purchases.filter(p => p.paymentStatus !== 'paid').length;

    res.json({
      totalAmount,
      totalPaid,
      pendingAmount,
      vendorCount: vendors.length,
      purchaseCount: purchases.length,
      paymentCount: payments.length,
      pendingPurchases
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent purchases
router.get('/recent', auth, async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: req.userId })
      .populate('vendorId', 'name')
      .sort({ date: -1 })
      .limit(10);

    res.json(purchases);
  } catch (error) {
    console.error('Recent purchases error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending payments
router.get('/pending', auth, async (req, res) => {
  try {
    const purchases = await Purchase.find({
      userId: req.userId,
      paymentStatus: { $ne: 'paid' }
    })
      .populate('vendorId', 'name phone')
      .sort({ date: -1 });

    res.json(purchases);
  } catch (error) {
    console.error('Pending payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get category-wise spending
router.get('/category-wise', auth, async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: req.userId });

    const categoryMap = {};

    purchases.forEach(purchase => {
      purchase.items.forEach(item => {
        const category = item.category || 'Uncategorized';
        if (!categoryMap[category]) {
          categoryMap[category] = { amount: 0, count: 0 };
        }
        categoryMap[category].amount += item.amount;
        categoryMap[category].count += 1;
      });
    });

    const categoryData = Object.entries(categoryMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.amount - a.amount);

    res.json(categoryData);
  } catch (error) {
    console.error('Category-wise error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get monthly spending
router.get('/monthly', auth, async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const purchases = await Purchase.find({
      userId: req.userId,
      date: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      }
    });

    const monthlyData = Array(12).fill(0).map((_, i) => ({
      month: i + 1,
      amount: 0
    }));

    purchases.forEach(purchase => {
      const month = new Date(purchase.date).getMonth();
      monthlyData[month].amount += purchase.totalAmount;
    });

    res.json(monthlyData);
  } catch (error) {
    console.error('Monthly spending error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get vendor-wise spending
router.get('/vendor-wise', auth, async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: req.userId })
      .populate('vendorId', 'name');

    const vendorMap = {};

    purchases.forEach(purchase => {
      const vendorName = purchase.vendorId?.name || purchase.vendorName || 'Unknown';
      if (!vendorMap[vendorName]) {
        vendorMap[vendorName] = { amount: 0, paid: 0, count: 0 };
      }
      vendorMap[vendorName].amount += purchase.totalAmount;
      vendorMap[vendorName].paid += purchase.amountPaid;
      vendorMap[vendorName].count += 1;
    });

    const vendorData = Object.entries(vendorMap)
      .map(([name, data]) => ({ name, ...data, pending: data.amount - data.paid }))
      .sort((a, b) => b.amount - a.amount);

    res.json(vendorData);
  } catch (error) {
    console.error('Vendor-wise error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
