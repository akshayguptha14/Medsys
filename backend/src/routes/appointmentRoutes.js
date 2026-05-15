const express = require('express');
const router = express.Router();
const { 
  setupAppointmentsTable, 
  getAppointments, 
  createAppointment, 
  updateAppointmentStatus, 
  deleteAppointment 
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

// Setup route
router.post('/setup', protect, setupAppointmentsTable);

// Core routes
router.route('/')
  .get(protect, getAppointments)
  .post(protect, createAppointment);

// Status update
router.put('/:id/status', protect, updateAppointmentStatus);

// Delete route
router.delete('/:id', protect, deleteAppointment);

module.exports = router;
