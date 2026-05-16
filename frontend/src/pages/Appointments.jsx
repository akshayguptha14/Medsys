import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Calendar as CalendarIcon, Clock, User, Stethoscope } from 'lucide-react';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/appointments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setAppointments(data);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Scheduled':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">Scheduled</span>;
      case 'Completed':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">Completed</span>;
      case 'Cancelled':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-50 text-rose-600 border border-rose-100 shadow-sm">Cancelled</span>;
      default:
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-600 border border-slate-200 shadow-sm">{status}</span>;
    }
  };

  const filtered = appointments.filter(a => 
    a.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-slide-up space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Appointments</h1>
          <p className="text-slate-500 mt-1">Schedule and manage consultations</p>
        </div>
        <Link 
          to="/appointments/book" 
          className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
        >
          <Plus size={20} />
          Book Appointment
        </Link>
      </div>

      <div className="glass rounded-2xl border border-white/40 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-white/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by patient or doctor name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">Today</button>
            <button className="px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-sm font-bold">All</button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-4 font-semibold">Patient</th>
                  <th className="px-6 py-4 font-semibold">Doctor</th>
                  <th className="px-6 py-4 font-semibold">Date & Time</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white/40">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{app.patient_name}</p>
                          <p className="text-xs text-slate-500">ID: #{app.patient_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                          <Stethoscope size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{app.doctor_name}</p>
                          <p className="text-xs text-indigo-500 font-medium">{app.doctor_specialization}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                          <CalendarIcon size={14} className="text-indigo-400" />
                          {new Date(app.appointment_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock size={14} className="text-cyan-400" />
                          {app.appointment_time}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-indigo-600 font-semibold text-sm transition-colors mr-3">
                        Edit
                      </button>
                      {app.status === 'Scheduled' && (
                        <button className="text-slate-400 hover:text-rose-600 font-semibold text-sm transition-colors">
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <CalendarIcon size={32} className="text-indigo-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Appointments</h3>
            <p className="text-slate-500 mt-1 max-w-sm">
              No appointments found. Book a new appointment to see it listed here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
