const { ApiKey } = require('../models');

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

module.exports = { apiKeyAuth };
