import React, { useContext, useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Bell, Search, LogOut, User, Settings, CheckCircle, Clock, Command } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import CommandPalette from '../components/CommandPalette';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Command Palette Keyboard Shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const notifications = [
    { id: 1, text: "New appointment scheduled with Dr. Smith", time: "5m ago", icon: <CheckCircle size={14} className="text-emerald-500" /> },
    { id: 2, text: "Patient record updated for John Doe", time: "1h ago", icon: <Clock size={14} className="text-indigo-500" /> },
    { id: 3, text: "System maintenance scheduled for tonight", time: "3h ago", icon: <Clock size={14} className="text-rose-500" /> },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7fa]">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-cyan-400/10 blur-[100px] rounded-full pointer-events-none"></div>

        <header className="h-20 glass border-b border-slate-200/50 flex items-center justify-between px-8 z-20 sticky top-0">
          <div className="flex-1 flex items-center">
            <div className="relative w-96 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Quick Command Button */}
            <button 
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 hover:bg-slate-200/80 text-slate-400 rounded-lg border border-slate-200 transition-all text-xs font-bold"
            >
              <Command size={14} />
              <span>Search...</span>
              <span className="ml-2 px-1 py-0.5 bg-white border border-slate-200 rounded text-[10px]">Ctrl K</span>
            </button>

            {/* Notification Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className={`relative p-2 transition-colors rounded-full ${isNotificationOpen ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-4 w-80 glass rounded-2xl border border-white/40 shadow-2xl overflow-hidden animate-slide-up z-50">
                  <div className="p-4 border-b border-slate-100 bg-white/50">
                    <h3 className="font-bold text-slate-800">Notifications</h3>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-4 hover:bg-indigo-50/50 transition-colors cursor-pointer border-b border-slate-50 last:border-0">
                        <div className="flex gap-3">
                          <div className="mt-1">{n.icon}</div>
                          <div>
                            <p className="text-sm text-slate-700 font-medium leading-tight">{n.text}</p>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-slate-50/50 text-center">
                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">View All Notifications</button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-8 w-[1px] bg-slate-200"></div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-4 cursor-pointer group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-indigo-600 font-medium tracking-wide uppercase">{user?.role || 'Administrator'}</p>
                </div>
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 border-2 border-white shadow-lg shadow-indigo-500/20 flex items-center justify-center text-white font-bold text-lg transform hover:scale-105 transition-transform">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
              </div>

              {isProfileOpen && (
                <div className="absolute right-0 mt-4 w-60 glass rounded-2xl border border-white/40 shadow-2xl overflow-hidden animate-slide-up z-50">
                  <div className="p-4 border-b border-slate-100 bg-white/50">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Account</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{user?.email || 'admin@example.com'}</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => { navigate('/settings'); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
                    >
                      <User size={16} />
                      Profile Settings
                    </button>
                    <button 
                      onClick={() => { navigate('/settings'); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
                    >
                      <Settings size={16} />
                      System Preferences
                    </button>
                    <div className="h-[1px] bg-slate-100 my-2"></div>
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-8 z-10 animate-fade-in relative">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
    </div>
  );
};

export default DashboardLayout;
