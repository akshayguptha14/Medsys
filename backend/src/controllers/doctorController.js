const db = require('../config/db');
const { createLog } = require('../utils/logger');

// @desc    Setup doctors table
// @route   POST /api/doctors/setup
// @access  Private (Admin/Doctor)
const setupDoctorsTable = async (req, res) => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS doctors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        specialization VARCHAR(255) NOT NULL,
        experience INT NOT NULL,
        phone VARCHAR(20) NOT NULL,
        department VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Insert some dummy data if table is empty
    const [existing] = await db.execute('SELECT * FROM doctors LIMIT 1');
    if (existing.length === 0) {
        await db.execute(`
            INSERT INTO doctors (name, specialization, experience, phone, department) VALUES 
            ('Dr. Alice Smith', 'Cardiology', 12, '555-0201', 'Cardiology Dept'),
            ('Dr. Bob Jones', 'Neurology', 8, '555-0202', 'Neurology Dept'),
            ('Dr. Clara Williams', 'Pediatrics', 15, '555-0203', 'Pediatrics Dept')
        `);
    }

    res.status(201).json({ message: 'Doctors table created and populated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during doctors setup' });
  }
};

// @desc    Get all doctors (with optional search)
// @route   GET /api/doctors
// @access  Private
const getDoctors = async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM doctors ORDER BY created_at DESC';
    let params = [];

    if (search) {
      query = 'SELECT * FROM doctors WHERE name LIKE ? OR specialization LIKE ? OR department LIKE ? ORDER BY created_at DESC';
      params = [`%${search}%`, `%${search}%`, `%${search}%`];
    }

    const [doctors] = await db.execute(query, params);
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching doctors' });
  }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Private
const getDoctorById = async (req, res) => {
  try {
    const [doctors] = await db.execute('SELECT * FROM doctors WHERE id = ?', [req.params.id]);
    
    if (doctors.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctors[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching doctor' });
  }
};

// @desc    Create a doctor
// @route   POST /api/doctors
// @access  Private
const createDoctor = async (req, res) => {
  const { name, specialization, experience, phone, department } = req.body;

  if (!name || !specialization || !experience || !phone || !department) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO doctors (name, specialization, experience, phone, department) VALUES (?, ?, ?, ?, ?)',
      [name, specialization, experience, phone, department]
    );

    // Add Log
    await createLog('Doctor Added', `Added new doctor: ${name}`, req.user?.id);
    
    res.status(201).json({ message: 'Doctor created successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating doctor' });
  }
};

// @desc    Update a doctor
// @route   PUT /api/doctors/:id
// @access  Private
const updateDoctor = async (req, res) => {
  const { name, specialization, experience, phone, department } = req.body;

  try {
    const [result] = await db.execute(
      'UPDATE doctors SET name = ?, specialization = ?, experience = ?, phone = ?, department = ? WHERE id = ?',
      [name, specialization, experience, phone, department, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Add Log
    await createLog('Doctor Updated', `Updated details for doctor ID: ${req.params.id}`, req.user?.id);

    res.json({ message: 'Doctor updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating doctor' });
  }
};

// @desc    Delete a doctor
// @route   DELETE /api/doctors/:id
// @access  Private
const deleteDoctor = async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM doctors WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Add Log
    await createLog('Doctor Removed', `Removed doctor record ID: ${req.params.id}`, req.user?.id);

    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting doctor' });
  }
};

module.exports = {
  setupDoctorsTable,
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
};
