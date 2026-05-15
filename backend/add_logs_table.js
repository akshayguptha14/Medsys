const mysql = require('mysql2/promise');
require('dotenv').config();

async function addLogsTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'medical_db'
  });

  try {
    console.log('Creating logs table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        action VARCHAR(255) NOT NULL,
        details TEXT,
        admin_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES users(id)
      )
    `);
    
    // Check if sample log exists
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM logs');
    if (rows[0].count === 0) {
      await connection.execute(
        'INSERT INTO logs (action, details, admin_id) VALUES (?, ?, ?)',
        ['System Update', 'Audit logging system enabled', 1]
      );
    }
    
    console.log('Logs table created successfully!');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    await connection.end();
  }
}

addLogsTable();
