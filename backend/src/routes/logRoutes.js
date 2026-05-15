const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getLogs);

module.exports = router;
