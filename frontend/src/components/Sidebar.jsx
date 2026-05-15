import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Settings, Activity, Stethoscope } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Patients', path: '/patients', icon: <Users size={20} /> },
    { name: 'Doctors', path: '/doctors', icon: <Stethoscope size={20} /> },
    { name: 'Appointments', path: '/appointments', icon: <Calendar size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <Activity size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 text-slate-200 min-h-screen flex flex-col shadow-2xl transition-all duration-300 relative z-20">
      {/* Abstract Background Element */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none"></div>

      <div className="h-24 flex items-center px-8 border-b border-slate-800/50 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white transform transition-transform hover:scale-105 hover:rotate-3 duration-300">
            <Activity size={22} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent font-['Outfit'] tracking-tight">MedSys</h1>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-8 px-4 relative z-10">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 px-4">Main Menu</p>
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group overflow-hidden relative ${
                  isActive
                    ? 'text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active State Background gradient */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-cyan-500/90 opacity-100"></div>
                  )}
                  {/* Hover State Background */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  )}
                  
                  <div className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </div>
                  <span className={`relative z-10 font-medium ${isActive ? 'font-semibold tracking-wide' : ''}`}>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
