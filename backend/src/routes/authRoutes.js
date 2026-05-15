const express = require('express');
const router = express.Router();
const { loginUser, setupUsers, updateProfile } = require('../controllers/authController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/setup', setupUsers);
router.put('/profile', protect, updateProfile);

// Example of a protected route using both middlewares
router.get('/me', protect, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user });
});

router.get('/admin-only', protect, requireRole('Admin'), (req, res) => {
  res.json({ message: 'Welcome Admin' });
});

module.exports = router;
