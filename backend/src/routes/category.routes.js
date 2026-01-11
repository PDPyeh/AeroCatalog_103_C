const express = require('express');
const { Category } = require('../models');
const { apiKeyOrAdminAuth } = require('../middleware/apiKeyAuth');
const router = express.Router();

// Get all categories (public)
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true },
      include: ['aircraft'],
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
});

// Get single category (public)
router.get('/:id', async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: ['aircraft'],
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

// Create category (Admin with JWT or API Key)
router.post('/', apiKeyOrAdminAuth, async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const category = await Category.create({ name, description });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

// Update category (Admin with JWT or API Key)
router.put('/:id', apiKeyOrAdminAuth, async (req, res, next) => {
  try {
    let category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await category.update(req.body);

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

// Delete category (Admin with JWT or API Key)
router.delete('/:id', apiKeyOrAdminAuth, async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await category.destroy();

    res.status(200).json({
      success: true,
      message: 'Category deleted',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

