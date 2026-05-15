import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Patients from './pages/Patients';
import PatientForm from './pages/PatientForm';
import Doctors from './pages/Doctors';
import DoctorForm from './pages/DoctorForm';
import Appointments from './pages/Appointments';
import AppointmentForm from './pages/AppointmentForm';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="patients/add" element={<PatientForm />} />
            <Route path="patients/edit/:id" element={<PatientForm />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="doctors/add" element={<DoctorForm />} />
            <Route path="doctors/edit/:id" element={<DoctorForm />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="appointments/book" element={<AppointmentForm />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
