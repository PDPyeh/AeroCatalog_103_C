const express = require('express');
const { Manufacturer } = require('../models');
const { apiKeyAuth } = require('../middleware/apiKeyAuth');
const router = express.Router();

// Get all manufacturers (public)
router.get('/', async (req, res, next) => {
  try {
    const manufacturers = await Manufacturer.findAll({
      where: { isActive: true },
      include: ['aircraft'],
    });

    res.status(200).json({
      success: true,
      count: manufacturers.length,
      data: manufacturers,
    });
  } catch (error) {
    next(error);
  }
});

// Get single manufacturer (public)
router.get('/:id', async (req, res, next) => {
  try {
    const manufacturer = await Manufacturer.findByPk(req.params.id, {
      include: ['aircraft'],
    });

    if (!manufacturer) {
      return res.status(404).json({ success: false, message: 'Manufacturer not found' });
    }

    res.status(200).json({
      success: true,
      data: manufacturer,
    });
  } catch (error) {
    next(error);
  }
});

// Create manufacturer (Admin with API Key)
router.post('/', apiKeyAuth, async (req, res, next) => {
  try {
    const { name, country, description, image } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Manufacturer name is required' });
    }

    const manufacturer = await Manufacturer.create({
      name,
      country,
      description,
      image,
    });

    res.status(201).json({
      success: true,
      data: manufacturer,
    });
  } catch (error) {
    next(error);
  }
});

// Update manufacturer (Admin with API Key)
router.put('/:id', apiKeyAuth, async (req, res, next) => {
  try {
    let manufacturer = await Manufacturer.findByPk(req.params.id);

    if (!manufacturer) {
      return res.status(404).json({ success: false, message: 'Manufacturer not found' });
    }

    await manufacturer.update(req.body);

    res.status(200).json({
      success: true,
      data: manufacturer,
    });
  } catch (error) {
    next(error);
  }
});

// Delete manufacturer (Admin with API Key)
router.delete('/:id', apiKeyAuth, async (req, res, next) => {
  try {
    const manufacturer = await Manufacturer.findByPk(req.params.id);

    if (!manufacturer) {
      return res.status(404).json({ success: false, message: 'Manufacturer not found' });
    }

    await manufacturer.destroy();

    res.status(200).json({
      success: true,
      message: 'Manufacturer deleted',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
