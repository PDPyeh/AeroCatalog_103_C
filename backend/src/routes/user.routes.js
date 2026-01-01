const express = require('express');
const { User } = require('../models');
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

// Get current admin profile
router.get('/profile/me', verifyToken, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: ['apiKeys'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// Update admin profile
router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    if (req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only allow updating name
    await user.update({ name: req.body.name });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

