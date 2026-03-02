import express from 'express';
import Category, { defaultCategories } from '../models/Category.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all categories
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.userId }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Sync categories - adds missing default categories for existing users
router.post('/sync', auth, async (req, res) => {
  try {
    const existingCategories = await Category.find({ userId: req.userId });
    const existingNames = existingCategories.map(c => c.name.toLowerCase());

    // Find categories that don't exist yet
    const missingCategories = defaultCategories.filter(
      cat => !existingNames.includes(cat.name.toLowerCase())
    );

    let addedCount = 0;

    if (missingCategories.length > 0) {
      const categoriesToAdd = missingCategories.map(cat => ({
        ...cat,
        userId: req.userId,
        isDefault: true
      }));
      await Category.insertMany(categoriesToAdd);
      addedCount = missingCategories.length;
    }

    // Return updated list
    const categories = await Category.find({ userId: req.userId }).sort({ name: 1 });

    res.json({
      message: addedCount > 0 ? `Added ${addedCount} new categories` : 'Categories up to date',
      added: addedCount,
      categories
    });
  } catch (error) {
    console.error('Sync categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add custom category
router.post('/', auth, async (req, res) => {
  try {
    const { name, nameHi, icon, color } = req.body;

    const category = new Category({
      userId: req.userId,
      name,
      nameHi,
      icon: icon || 'Category',
      color: color || '#1976d2',
      isDefault: false
    });
    await category.save();

    res.status(201).json({ message: 'Category added', category });
  } catch (error) {
    console.error('Add category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update category
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, nameHi, icon, color } = req.body;

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { name, nameHi, icon, color },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category updated', category });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete category (only non-default)
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, userId: req.userId });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.isDefault) {
      return res.status(400).json({ message: 'Cannot delete default category' });
    }

    await category.deleteOne();
    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
