const db = require('../config/db');

/**
 * Creates an audit log entry in the database.
 * @param {string} action - The action performed (e.g., 'Create Patient')
 * @param {string} details - Detailed description of the action
 * @param {number} adminId - The ID of the admin who performed the action
 */
const createLog = async (action, details, adminId) => {
  try {
    await db.execute(
      'INSERT INTO logs (action, details, admin_id) VALUES (?, ?, ?)',
      [action, details, adminId || 1] // Fallback to ID 1 if not provided
    );
  } catch (error) {
    console.error('Logging Error:', error);
  }
};

module.exports = { createLog };
