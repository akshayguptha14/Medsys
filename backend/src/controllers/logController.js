const db = require('../config/db');

// @desc    Get all audit logs
// @route   GET /api/logs
// @access  Private (Admin)
const getLogs = async (req, res) => {
  try {
    const [logs] = await db.execute(`
      SELECT l.*, u.name as admin_name 
      FROM logs l
      LEFT JOIN users u ON l.admin_id = u.id
      ORDER BY l.created_at DESC
      LIMIT 50
    `);
    res.json(logs);
  } catch (error) {
    console.error('Fetch Logs Error:', error);
    res.status(500).json({ message: 'Server error while fetching logs' });
  }
};

module.exports = { getLogs };
