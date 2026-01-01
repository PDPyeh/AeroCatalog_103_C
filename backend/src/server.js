const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { mongodbConnection, sequelize } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
require('./models');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongodbConnection();

// Sync database
sequelize.sync({ alter: false }).catch((err) => {
  console.error('Error syncing database:', err);
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/aircraft', require('./routes/aircraft.routes'));
app.use('/api/manufacturers', require('./routes/manufacturer.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/admin/api-keys', require('./routes/apikey.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date() });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

