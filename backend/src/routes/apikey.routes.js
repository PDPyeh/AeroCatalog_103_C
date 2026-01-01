const express = require('express');
const { User, ApiKey } = require('../models');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware untuk verify JWT token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Generate new API Key
router.post('/generate', verifyToken, async (req, res, next) => {
  try {
    const { name } = req.body;

    const newApiKey = ApiKey.generateKey();

    const apiKey = await ApiKey.create({
      userId: req.user.id,
      key: newApiKey,
      name: name || 'API Key',
    });

    res.status(201).json({
      success: true,
      message: 'API Key generated successfully. Save it now, you won\'t be able to see it again.',
      data: {
        id: apiKey.id,
        name: apiKey.name,
        key: newApiKey,
        createdAt: apiKey.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get all API Keys for user
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const apiKeys = await ApiKey.findAll({
      where: { userId: req.user.id },
      attributes: { exclude: ['key'] }, // Don't return full key
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      count: apiKeys.length,
      data: apiKeys,
    });
  } catch (error) {
    next(error);
  }
});

// Revoke API Key
router.delete('/:keyId', verifyToken, async (req, res, next) => {
  try {
    const apiKey = await ApiKey.findOne({
      where: { id: req.params.keyId, userId: req.user.id },
    });

    if (!apiKey) {
      return res.status(404).json({ message: 'API Key not found' });
    }

    await apiKey.destroy();

    res.status(200).json({
      success: true,
      message: 'API Key revoked successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
