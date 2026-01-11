const { sequelize } = require('./src/config/database');
require('dotenv').config();

async function cleanup() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Delete all api_keys
    const result = await sequelize.query('DELETE FROM api_keys');
    console.log('✅ Deleted all API keys from database');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

cleanup();
