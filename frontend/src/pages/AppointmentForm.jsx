import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Save } from 'lucide-react';

const AppointmentForm = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    status: 'Scheduled'
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
      
      const pRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/patients`, { headers });
      const pData = await pRes.json();
      if(Array.isArray(pData)) {
        setPatients(pData);
        if(pData.length > 0) setFormData(prev => ({ ...prev, patient_id: pData[0].id }));
      }

      const dRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/doctors`, { headers });
      const dData = await dRes.json();
      if(Array.isArray(dData)) {
        setDoctors(dData);
        if(dData.length > 0) setFormData(prev => ({ ...prev, doctor_id: dData[0].id }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/appointments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/appointments');
      } else {
        const errorData = await response.json();
        alert('Booking failed: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-slide-up space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          to="/appointments" 
          className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 rounded-xl transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Book Appointment</h1>
          <p className="text-slate-500 mt-1">Schedule a consultation between a patient and a doctor.</p>
        </div>
      </div>

      <div className="glass rounded-3xl border border-white/40 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/10 to-cyan-400/10 blur-[100px] rounded-full pointer-events-none -mr-40 -mt-40"></div>
        
        <form onSubmit={handleSubmit} className="p-8 sm:p-10 relative z-10">
          
          <div className="pb-4 border-b border-slate-100 mb-8">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Calendar size={18} className="text-indigo-500" />
              Scheduling Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Patient</label>
                <select
                  name="patient_id"
                  required
                  value={formData.patient_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-sm"
                >
                  <option value="" disabled>-- Choose a Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Doctor</label>
                <select
                  name="doctor_id"
                  required
                  value={formData.doctor_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-sm"
                >
                  <option value="" disabled>-- Choose a Doctor --</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>Dr. {d.name} ({d.specialization})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Appointment Date</label>
                <input
                  type="date"
                  name="appointment_date"
                  required
                  value={formData.appointment_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Time Slot</label>
                <input
                  type="time"
                  name="appointment_time"
                  required
                  value={formData.appointment_time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end gap-4">
            <Link 
              to="/appointments"
              className="px-6 py-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 rounded-xl font-semibold shadow-sm transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading || patients.length === 0 || doctors.length === 0}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Booking...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Book Appointment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
