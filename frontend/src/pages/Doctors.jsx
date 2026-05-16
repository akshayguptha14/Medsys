import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Stethoscope, Phone, Award } from 'lucide-react';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/doctors`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setDoctors(data);
      } else {
        setDoctors([]);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-slide-up space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Medical Staff</h1>
          <p className="text-slate-500 mt-1">Manage doctor profiles and departments</p>
        </div>
        <Link 
          to="/doctors/add" 
          className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Doctor
        </Link>
      </div>

      <div className="glass rounded-2xl border border-white/40 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-white/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, specialization, or dept..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-sm"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-50 to-cyan-50 opacity-50"></div>
                
                <div className="relative z-10 flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl shadow-inner">
                    {doctor.name.replace('Dr. ', '').charAt(0)}
                  </div>
                  <span className="bg-cyan-50 text-cyan-700 text-xs font-bold px-3 py-1 rounded-full border border-cyan-100">
                    {doctor.department}
                  </span>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-slate-800">{doctor.name}</h3>
                  <p className="text-indigo-600 font-medium text-sm mb-4">{doctor.specialization}</p>
                  
                  <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Phone size={16} className="text-slate-400" />
                      {doctor.phone}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Award size={16} className="text-amber-400" />
                      {doctor.experience} Years Experience
                    </div>
                  </div>
                  
                  <button className="w-full mt-6 bg-slate-50 hover:bg-indigo-50 text-indigo-600 border border-slate-200 hover:border-indigo-200 py-2 rounded-xl font-semibold text-sm transition-colors">
                    View Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <Stethoscope size={32} className="text-indigo-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Doctors Found</h3>
            <p className="text-slate-500 mt-1 max-w-sm">
              We couldn't find any medical staff matching your search. Add a new doctor to the roster.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
