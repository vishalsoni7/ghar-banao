import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Category, { defaultCategories } from '../models/Category.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

// Validation helpers
const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, password, projectName } = req.body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters' });
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({ message: 'Please enter a valid phone number (10-15 digits)' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ phone: phone.trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim()?.toLowerCase() || '',
      password: hashedPassword,
      projectName: projectName?.trim() || 'My House Construction'
    });
    await user.save();

    // Create default categories for user
    const categories = defaultCategories.map(cat => ({
      ...cat,
      userId: user._id,
      isDefault: true
    }));
    await Category.insertMany(categories);

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        projectName: user.projectName
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Validation
    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password are required' });
    }

    // Find user
    const user = await User.findOne({ phone: phone.trim() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid phone number or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid phone number or password' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        projectName: user.projectName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      phone: req.user.phone,
      email: req.user.email,
      projectName: req.user.projectName
    }
  });
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, projectName } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, email, projectName },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile updated',
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        projectName: user.projectName
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
