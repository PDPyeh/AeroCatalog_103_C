const { sequelize } = require('./src/config/database');
require('./src/models');
require('dotenv').config();

async function fixApiKeys() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Drop api_keys table if exists
    await sequelize.query('DROP TABLE IF EXISTS api_keys');
    console.log('✅ Dropped api_keys table');

    // Sync all models
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Synced all models');

    // Check tables
    const result = await sequelize.query(`
      SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'aerocatalog'
    `);
    console.log('✅ Tables in database:', result[0].map(r => r.TABLE_NAME));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixApiKeys();
