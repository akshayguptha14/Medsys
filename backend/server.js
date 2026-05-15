const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/patients', require('./src/routes/patientRoutes'));
app.use('/api/doctors', require('./src/routes/doctorRoutes'));
app.use('/api/appointments', require('./src/routes/appointmentRoutes'));
app.use('/api/analytics', require('./src/routes/analyticsRoutes'));
app.use('/api/logs', require('./src/routes/logRoutes'));

app.get('/', (req, res) => {
  res.send('Medical Management System API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
