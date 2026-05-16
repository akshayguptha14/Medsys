import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, User, Phone, MapPin, Activity, Download } from 'lucide-react';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Age', 'Gender', 'Phone', 'Address', 'Blood Group', 'Created At'];
    const csvRows = [
      headers.join(','),
      ...patients.map(p => [
        p.id,
        `"${p.name}"`,
        p.age,
        p.gender,
        p.phone,
        `"${p.address}"`,
        p.blood_group,
        p.created_at
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `patients_report_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/patients`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setPatients(data);
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  return (
    <div className="animate-slide-up space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Patients</h1>
          <p className="text-slate-500 mt-1">Manage and view patient records</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportToCSV}
            className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all flex items-center gap-2"
          >
            <Download size={20} />
            Export CSV
          </button>
          <Link 
            to="/patients/add" 
            className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Patient
          </Link>
        </div>
      </div>

      <div className="glass rounded-2xl border border-white/40 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-white/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search patients by name or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-sm"
            />
          </div>
          <div className="text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
            Total Records: <span className="text-indigo-600 font-bold">{filteredPatients.length}</span>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredPatients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-4 font-semibold">Patient Info</th>
                  <th className="px-6 py-4 font-semibold">Contact</th>
                  <th className="px-6 py-4 font-semibold">Details</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white/40">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-cyan-100 text-indigo-700 flex items-center justify-center font-bold shadow-inner">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{patient.name}</p>
                          <p className="text-xs text-slate-500">ID: #{patient.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
                        <Phone size={14} className="text-indigo-400" />
                        {patient.phone}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <MapPin size={14} className="text-cyan-400" />
                        {patient.address}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          {patient.age} yrs
                        </span>
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          {patient.gender}
                        </span>
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                          {patient.blood_group}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm transition-colors hover:underline">
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <User size={32} className="text-indigo-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Patients Found</h3>
            <p className="text-slate-500 mt-1 max-w-sm">
              We couldn't find any patient records matching your search. Add a new patient to get started.
            </p>
            <Link 
              to="/patients/add" 
              className="mt-6 bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50 px-5 py-2 rounded-xl font-medium shadow-sm transition-colors"
            >
              Add New Patient
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;
