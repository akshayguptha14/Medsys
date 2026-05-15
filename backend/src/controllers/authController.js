const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id, name, role) => {
  return jwt.sign({ id, name, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user email
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.name, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Setup dummy users
// @route   POST /api/auth/setup
// @access  Public
const setupUsers = async (req, res) => {
  try {
    // Create table if not exists
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('Admin', 'Doctor', 'Receptionist') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if users already exist
    const [existingUsers] = await db.execute('SELECT * FROM users');
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Users already exist', users: existingUsers });
    }

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Insert dummy users
    await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)',
      [
        'Admin User', 'admin@example.com', hashedPassword, 'Admin',
        'Dr. Smith', 'doctor@example.com', hashedPassword, 'Doctor',
        'Jane Doe', 'receptionist@example.com', hashedPassword, 'Receptionist'
      ]
    );

    res.status(201).json({ message: 'Users table created and dummy users inserted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during setup' });
  }
};

// @desc    Update user profile (Settings)
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.user.id; // From auth middleware

    let query = 'UPDATE users SET name = ?, email = ?';
    let params = [name, email];

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      query += ', password = ?';
      params.push(hashedPassword);
    }

    query += ' WHERE id = ?';
    params.push(userId);

    await db.execute(query, params);

    // Return updated user data (excluding password)
    const [updatedUsers] = await db.execute('SELECT id, name, email, role FROM users WHERE id = ?', [userId]);
    
    if (updatedUsers.length > 0) {
      res.json({ message: 'Profile updated successfully', user: updatedUsers[0] });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

module.exports = {
  loginUser,
  setupUsers,
  updateProfile
};
