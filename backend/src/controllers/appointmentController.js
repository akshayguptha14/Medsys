const db = require('../config/db');
const { createLog } = require('../utils/logger');

// @desc    Setup appointments table
// @route   POST /api/appointments/setup
// @access  Private (Admin/Doctor)
const setupAppointmentsTable = async (req, res) => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        doctor_id INT NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        status ENUM('Scheduled', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
      )
    `);
    
    // Check if empty, maybe insert dummy data if doctors and patients exist
    const [existing] = await db.execute('SELECT * FROM appointments LIMIT 1');
    if (existing.length === 0) {
        // Try to get at least one patient and one doctor to create a dummy appointment
        const [patients] = await db.execute('SELECT id FROM patients LIMIT 1');
        const [doctors] = await db.execute('SELECT id FROM doctors LIMIT 1');
        
        if (patients.length > 0 && doctors.length > 0) {
            const today = new Date().toISOString().split('T')[0];
            await db.execute(
                'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)',
                [patients[0].id, doctors[0].id, today, '10:00:00', 'Scheduled']
            );
        }
    }

    res.status(201).json({ message: 'Appointments table created successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during appointments setup' });
  }
};

// @desc    Get all appointments (with JOINs to get names)
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  try {
    // This is the core DBMS query with JOINs
    const query = `
      SELECT 
        a.id, 
        a.appointment_date, 
        a.appointment_time, 
        a.status,
        a.created_at,
        p.id as patient_id,
        p.name as patient_name, 
        d.id as doctor_id,
        d.name as doctor_name,
        d.department as doctor_department
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `;
    
    const [appointments] = await db.execute(query);
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching appointments' });
  }
};

// @desc    Create an appointment (with double booking check)
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  const { patient_id, doctor_id, appointment_date, appointment_time } = req.body;

  if (!patient_id || !doctor_id || !appointment_date || !appointment_time) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    // DBMS Logic: Prevent Double Booking
    // Check if doctor already has a 'Scheduled' appointment at this exact date & time
    const [existing] = await db.execute(
      'SELECT id FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status = ?',
      [doctor_id, appointment_date, appointment_time, 'Scheduled']
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'This doctor is already booked for this date and time.' });
    }

    const [result] = await db.execute(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time) VALUES (?, ?, ?, ?)',
      [patient_id, doctor_id, appointment_date, appointment_time]
    );

    // Add Log
    await createLog('Appointment Booked', `Booked appointment for patient ID: ${patient_id} with doctor ID: ${doctor_id}`, req.user?.id);
    
    res.status(201).json({ message: 'Appointment booked successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating appointment' });
  }
};

// @desc    Update appointment status (Cancel/Complete)
// @route   PUT /api/appointments/:id/status
// @access  Private
const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;

  if (!['Scheduled', 'Completed', 'Cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const [result] = await db.execute(
      'UPDATE appointments SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Add Log
    await createLog('Appointment Status Changed', `Updated status to ${status} for appointment ID: ${req.params.id}`, req.user?.id);

    res.json({ message: 'Appointment status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating appointment status' });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM appointments WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Add Log
    await createLog('Appointment Cancelled/Deleted', `Removed appointment record ID: ${req.params.id}`, req.user?.id);

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting appointment' });
  }
};

module.exports = {
  setupAppointmentsTable,
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment
};
