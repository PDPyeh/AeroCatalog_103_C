const { sequelize } = require('./src/config/database');
const { Admin } = require('./src/models');

async function migrateUsersToAdmins() {
  try {
    console.log('🔄 Starting migration: users → admins');

    // Create admins table if not exists
    await sequelize.sync({ alter: true });
    console.log('✅ Tables synchronized');

    // Check if there are any existing users
    const [existingUsers] = await sequelize.query(
      'SELECT * FROM users WHERE role = "admin"'
    );

    if (existingUsers.length > 0) {
      console.log(`\n📋 Found ${existingUsers.length} admin user(s) to migrate:`);

      for (const user of existingUsers) {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ where: { email: user.email } });
        
        if (!existingAdmin) {
          await Admin.create({
            name: user.name,
            email: user.email,
            password: user.password, // Already hashed
            role: 'admin',
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          });
          console.log(`✅ Migrated: ${user.email}`);
        } else {
          console.log(`⚠️  Skipped (already exists): ${user.email}`);
        }
      }

      console.log('\n✅ Migration completed successfully!');
    } else {
      console.log('⚠️  No admin users found in users table');
      console.log('Creating default admin account...');
      
      // Create default admin
      await Admin.create({
        name: 'Admin',
        email: 'admin@aerocatalog.com',
        password: 'admin123', // Will be hashed by hook
        role: 'admin',
        isActive: true,
      });
      
      console.log('✅ Default admin created:');
      console.log('   Email: admin@aerocatalog.com');
      console.log('   Password: admin123');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

migrateUsersToAdmins();
