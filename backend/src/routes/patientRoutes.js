const express = require('express');
const router = express.Router();
const { 
  setupPatientsTable, 
  getPatients, 
  getPatientById, 
  createPatient, 
  updatePatient, 
  deletePatient 
} = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');

// Setup route (can be hit manually to create table)
router.post('/setup', protect, setupPatientsTable);

// CRUD routes (all protected)
router.route('/')
  .get(protect, getPatients)
  .post(protect, createPatient);

router.route('/:id')
  .get(protect, getPatientById)
  .put(protect, updatePatient)
  .delete(protect, deletePatient);

module.exports = router;
