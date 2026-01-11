const { ApiKey } = require('../models');
const jwt = require('jsonwebtoken');

const apiKeyAuth = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({ message: 'API key is required' });
    }

    const key = await ApiKey.findOne({ where: { key: apiKey, isActive: true } });

    if (!key) {
      return res.status(401).json({ message: 'Invalid API key' });
    }

    // Update last used
    await key.update({ lastUsed: new Date() });

    // Attach user and API key to request
    req.user = { id: key.userId };
    req.apiKey = key;

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error authenticating API key' });
  }
};

// Middleware that accepts BOTH admin JWT tokens AND API keys for CRUD operations
const apiKeyOrAdminAuth = async (req, res, next) => {
  try {
    // Check for JWT token first (for admin)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Check if it's an admin token
        if (decoded.role === 'admin') {
          req.user = decoded;
          return next();
        }
      } catch (err) {
        // If JWT verification fails, try API key
      }
    }

    // If no valid JWT, check for API key
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ message: 'Authentication required (API key or Admin token)' });
    }

    const key = await ApiKey.findOne({ where: { key: apiKey, isActive: true } });
    if (!key) {
      return res.status(401).json({ message: 'Invalid API key' });
    }

    // Update last used
    await key.update({ lastUsed: new Date() });

    // Attach user and API key to request
    req.user = { id: key.userId };
    req.apiKey = key;

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error authenticating request' });
  }
};

module.exports = { apiKeyAuth, apiKeyOrAdminAuth };
