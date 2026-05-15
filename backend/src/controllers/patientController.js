const db = require('../config/db');
const { createLog } = require('../utils/logger');

// @desc    Setup patients table
// @route   POST /api/patients/setup
// @access  Private (Admin/Doctor)
const setupPatientsTable = async (req, res) => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS patients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        gender ENUM('Male', 'Female', 'Other') NOT NULL,
        phone VARCHAR(20) NOT NULL,
        address TEXT NOT NULL,
        blood_group VARCHAR(5) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Insert some dummy data if table is empty
    const [existing] = await db.execute('SELECT * FROM patients LIMIT 1');
    if (existing.length === 0) {
        await db.execute(`
            INSERT INTO patients (name, age, gender, phone, address, blood_group) VALUES 
            ('John Doe', 45, 'Male', '555-0101', '123 Main St, Cityville', 'O+'),
            ('Jane Smith', 32, 'Female', '555-0102', '456 Oak Ave, Townsburg', 'A-'),
            ('Robert Johnson', 58, 'Male', '555-0103', '789 Pine Ln, Villageton', 'B+')
        `);
    }

    res.status(201).json({ message: 'Patients table created and populated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during patients setup' });
  }
};

// @desc    Get all patients (with optional search)
// @route   GET /api/patients
// @access  Private
const getPatients = async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM patients ORDER BY created_at DESC';
    let params = [];

    if (search) {
      query = 'SELECT * FROM patients WHERE name LIKE ? OR phone LIKE ? ORDER BY created_at DESC';
      params = [`%${search}%`, `%${search}%`];
    }

    const [patients] = await db.execute(query, params);
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching patients' });
  }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
const getPatientById = async (req, res) => {
  try {
    const [patients] = await db.execute('SELECT * FROM patients WHERE id = ?', [req.params.id]);
    
    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json(patients[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching patient' });
  }
};

// @desc    Create a patient
// @route   POST /api/patients
// @access  Private
const createPatient = async (req, res) => {
  const { name, age, gender, phone, address, blood_group } = req.body;

  if (!name || !age || !gender || !phone || !address || !blood_group) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO patients (name, age, gender, phone, address, blood_group) VALUES (?, ?, ?, ?, ?, ?)',
      [name, age, gender, phone, address, blood_group]
    );

    // Add Log
    await createLog('Patient Registered', `Added new patient: ${name}`, req.user?.id);
    
    res.status(201).json({ message: 'Patient created successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating patient' });
  }
};

// @desc    Update a patient
// @route   PUT /api/patients/:id
// @access  Private
const updatePatient = async (req, res) => {
  const { name, age, gender, phone, address, blood_group } = req.body;

  try {
    const [result] = await db.execute(
      'UPDATE patients SET name = ?, age = ?, gender = ?, phone = ?, address = ?, blood_group = ? WHERE id = ?',
      [name, age, gender, phone, address, blood_group, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Add Log
    await createLog('Patient Updated', `Updated details for patient ID: ${req.params.id}`, req.user?.id);

    res.json({ message: 'Patient updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating patient' });
  }
};

// @desc    Delete a patient
// @route   DELETE /api/patients/:id
// @access  Private
const deletePatient = async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM patients WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Add Log
    await createLog('Patient Deleted', `Removed patient record ID: ${req.params.id}`, req.user?.id);

    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting patient' });
  }
};

module.exports = {
  setupPatientsTable,
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
};
