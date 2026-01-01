const { Sequelize } = require('sequelize');
require('dotenv').config();

async function checkDatabase() {
  // Connect without specific database
  const sequelize = new Sequelize(
    '', // no database
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'mysql',
      logging: false,
    }
  );

  try {
    const [results] = await sequelize.query(
      `SHOW DATABASES LIKE '${process.env.DB_NAME}'`
    );

    if (results.length > 0) {
      console.log(`✅ Database '${process.env.DB_NAME}' exists`);
    } else {
      console.log(`❌ Database '${process.env.DB_NAME}' does NOT exist`);
      console.log(`\nCreating database '${process.env.DB_NAME}'...`);
      
      await sequelize.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`✅ Database '${process.env.DB_NAME}' created successfully!`);
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await sequelize.close();
    process.exit(1);
  }
}

checkDatabase();
