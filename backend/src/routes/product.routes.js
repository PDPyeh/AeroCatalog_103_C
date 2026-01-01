const express = require('express');
const { Aircraft } = require('../models');
const { apiKeyAuth } = require('../middleware/apiKeyAuth');
const { Op } = require('sequelize');
const router = express.Router();

// Get all aircraft (public)
router.get('/', async (req, res, next) => {
  try {
    const { manufacturerId, categoryId, search } = req.query;

    let where = { isActive: true };

    if (manufacturerId) {
      where.manufacturerId = manufacturerId;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.modelName = { [Op.like]: `%${search}%` };
    }

    const aircraft = await Aircraft.findAll({
      where,
      include: ['manufacturer', 'category'],
      order: [['modelName', 'ASC']],
    });

    res.status(200).json({
      success: true,
      count: aircraft.length,
      data: aircraft,
    });
  } catch (error) {
    next(error);
  }
});

// Get single aircraft (public)
router.get('/:id', async (req, res, next) => {
  try {
    const aircraft = await Aircraft.findByPk(req.params.id, {
      include: ['manufacturer', 'category'],
    });

    if (!aircraft) {
      return res.status(404).json({ success: false, message: 'Aircraft not found' });
    }

    res.status(200).json({
      success: true,
      data: aircraft,
    });
  } catch (error) {
    next(error);
  }
});

// Create aircraft (Admin with API Key)
router.post('/', apiKeyAuth, async (req, res, next) => {
  try {
    const { manufacturerId, categoryId, modelName } = req.body;

    if (!modelName || !manufacturerId || !categoryId) {
      return res.status(400).json({ message: 'modelName, manufacturerId, and categoryId are required' });
    }

    const aircraft = await Aircraft.create(req.body);

    res.status(201).json({
      success: true,
      data: aircraft,
    });
  } catch (error) {
    next(error);
  }
});

// Update aircraft (Admin with API Key)
router.put('/:id', apiKeyAuth, async (req, res, next) => {
  try {
    let aircraft = await Aircraft.findByPk(req.params.id);

    if (!aircraft) {
      return res.status(404).json({ success: false, message: 'Aircraft not found' });
    }

    await aircraft.update(req.body);

    res.status(200).json({
      success: true,
      data: aircraft,
    });
  } catch (error) {
    next(error);
  }
});

// Delete aircraft (Admin with API Key)
router.delete('/:id', apiKeyAuth, async (req, res, next) => {
  try {
    const aircraft = await Aircraft.findByPk(req.params.id);

    if (!aircraft) {
      return res.status(404).json({ success: false, message: 'Aircraft not found' });
    }

    await aircraft.destroy();

    res.status(200).json({
      success: true,
      message: 'Aircraft deleted',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

