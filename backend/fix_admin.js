const db = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function fixAdmin() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    await db.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, 'admin@example.com']);
    
    console.log("Admin password successfully fixed!");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

fixAdmin();
