import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Activity, Calendar, Settings, Home, PlusCircle, Command, X } from 'lucide-react';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const commands = [
    { id: 'dashboard', title: 'Go to Dashboard', icon: <Home size={18} />, action: () => navigate('/') },
    { id: 'patients', title: 'View Patients', icon: <User size={18} />, action: () => navigate('/patients') },
    { id: 'add-patient', title: 'Add New Patient', icon: <PlusCircle size={18} />, action: () => navigate('/patients/add') },
    { id: 'doctors', title: 'View Doctors', icon: <Activity size={18} />, action: () => navigate('/doctors') },
    { id: 'add-doctor', title: 'Add New Doctor', icon: <PlusCircle size={18} />, action: () => navigate('/doctors/add') },
    { id: 'appointments', title: 'View Appointments', icon: <Calendar size={18} />, action: () => navigate('/appointments') },
    { id: 'book-appointment', title: 'Book Appointment', icon: <Calendar size={18} />, action: () => navigate('/appointments/book') },
    { id: 'analytics', title: 'View Analytics', icon: <Activity size={18} />, action: () => navigate('/analytics') },
    { id: 'settings', title: 'System Settings', icon: <Settings size={18} />, action: () => navigate('/settings') },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Palette */}
      <div className="relative w-full max-w-xl glass rounded-3xl border border-white/40 shadow-2xl overflow-hidden animate-slide-up">
        <div className="flex items-center px-6 py-4 border-b border-slate-100 bg-white/50">
          <Search className="text-indigo-500 mr-3" size={20} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands or pages... (Ctrl + K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none text-slate-800 font-medium placeholder-slate-400"
          />
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2">
          {filteredCommands.length > 0 ? (
            <div className="space-y-1">
              {filteredCommands.map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={() => { cmd.action(); onClose(); }}
                  className="w-full flex items-center gap-4 px-4 py-3 hover:bg-indigo-50/80 hover:text-indigo-700 rounded-2xl transition-all group text-left"
                >
                  <div className="p-2 bg-slate-50 group-hover:bg-white rounded-xl text-slate-400 group-hover:text-indigo-600 transition-colors">
                    {cmd.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-700">{cmd.title}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Navigation</p>
                  </div>
                  <Command size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Search className="mx-auto text-slate-200 mb-3" size={40} />
              <p className="text-slate-500 font-medium">No results for "{query}"</p>
            </div>
          )}
        </div>

        <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <kbd className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-500 shadow-sm">Enter</kbd>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Select</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-500 shadow-sm">Esc</kbd>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Close</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Medical Command Palette</p>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
