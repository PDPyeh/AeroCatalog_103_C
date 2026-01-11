const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('='.repeat(60));
  console.log('SQL Query untuk Insert Admin:');
  console.log('='.repeat(60));
  console.log(`
INSERT INTO admins (name, email, password, role, isActive, createdAt, updatedAt)
VALUES (
  'Admin Baru',
  'newadmin@aerocatalog.com',
  '${hash}',
  'admin',
  1,
  NOW(),
  NOW()
);
  `);
  console.log('='.repeat(60));
  console.log('Password asli: admin123');
  console.log('Hashed password:', hash);
  console.log('='.repeat(60));
  
  process.exit(0);
}

generateHash();
