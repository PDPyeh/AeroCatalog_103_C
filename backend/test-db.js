const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: console.log,
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Connection successful!');
    console.log('Database:', process.env.DB_NAME);
    console.log('Host:', process.env.DB_HOST);
    console.log('Port:', process.env.DB_PORT);
    console.log('User:', process.env.DB_USER);
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Unable to connect to MySQL:');
    console.error('Error:', error.message);
    console.error('\nConfig:');
    console.error('- DB_NAME:', process.env.DB_NAME);
    console.error('- DB_HOST:', process.env.DB_HOST);
    console.error('- DB_PORT:', process.env.DB_PORT);
    console.error('- DB_USER:', process.env.DB_USER);
    console.error('- DB_PASSWORD:', process.env.DB_PASSWORD ? '***set***' : 'NOT SET');
    process.exit(1);
  }
}

testConnection();
