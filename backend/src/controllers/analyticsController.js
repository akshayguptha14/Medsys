const db = require('../config/db');

// @desc    Get dashboard analytics
// @route   GET /api/analytics
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    // 1. Basic Counts
    const [[{ totalPatients }]] = await db.execute('SELECT COUNT(*) AS totalPatients FROM patients');
    const [[{ totalDoctors }]] = await db.execute('SELECT COUNT(*) AS totalDoctors FROM doctors');
    const [[{ todayAppointments }]] = await db.execute('SELECT COUNT(*) AS todayAppointments FROM appointments WHERE appointment_date = CURDATE()');

    // 2. Complex Aggregations (GROUP BY)
    const [appointmentsByStatus] = await db.execute('SELECT status AS name, COUNT(*) AS value FROM appointments GROUP BY status');
    
    // Fallback if appointments table is empty
    const statusData = appointmentsByStatus.length > 0 ? appointmentsByStatus : [
      { name: 'Scheduled', value: 0 },
      { name: 'Completed', value: 0 },
      { name: 'Cancelled', value: 0 }
    ];

    const [patientsByGender] = await db.execute('SELECT gender AS name, COUNT(*) AS value FROM patients GROUP BY gender');
    
    // 3. Recent Activity (JOINs)
    const [recentActivity] = await db.execute(`
      SELECT 
        a.id, 
        a.appointment_time as time, 
        p.name as patient_name, 
        d.name as doctor_name,
        a.status
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.created_at DESC
      LIMIT 4
    `);

    // Map recent activity for the frontend
    const mappedActivity = recentActivity.map(act => ({
      time: act.time,
      title: act.status === 'Scheduled' ? 'New Appointment' : `Appointment ${act.status}`,
      desc: `Dr. ${act.doctor_name.replace('Dr. ', '')} with ${act.patient_name}`
    }));

    res.json({
      kpis: {
        totalPatients,
        totalDoctors,
        todayAppointments,
        revenue: '$12,450' // Placeholder since we don't have a billing table
      },
      charts: {
        appointmentsByStatus: statusData,
        patientsByGender
      },
      recentActivity: mappedActivity
    });

  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ message: 'Server error while fetching analytics' });
  }
};

module.exports = {
  getAnalytics
};
