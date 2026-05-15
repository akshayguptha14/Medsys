const express = require('express');
const router = express.Router();
const { 
  setupDoctorsTable, 
  getDoctors, 
  getDoctorById, 
  createDoctor, 
  updateDoctor, 
  deleteDoctor 
} = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');

// Setup route (can be hit manually to create table)
router.post('/setup', protect, setupDoctorsTable);

// CRUD routes (all protected)
router.route('/')
  .get(protect, getDoctors)
  .post(protect, createDoctor);

router.route('/:id')
  .get(protect, getDoctorById)
  .put(protect, updateDoctor)
  .delete(protect, deleteDoctor);

module.exports = router;
