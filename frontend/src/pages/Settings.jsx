import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Settings as SettingsIcon, Shield, Globe, Save, User, Clock, CheckCircle } from 'lucide-react';

const Settings = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (activeTab === 'security') {
      fetchLogs();
    }
  }, [activeTab]);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/logs`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        updateUser(data.user);
        setSuccessMsg('Profile updated successfully!');
        setFormData(prev => ({ ...prev, password: '' })); // Clear password field
      } else {
        alert('Failed to update: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-slide-up space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">System Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account profile and application settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Navigation */}
        <div className="lg:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-semibold rounded-xl border transition-all ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700 border-indigo-100 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 border-transparent'}`}
          >
            <User size={18} />
            Profile Preferences
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-semibold rounded-xl border transition-all ${activeTab === 'security' ? 'bg-indigo-50 text-indigo-700 border-indigo-100 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 border-transparent'}`}
          >
            <Shield size={18} />
            Security Log
          </button>
          <button 
            onClick={() => setActiveTab('region')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-semibold rounded-xl border transition-all ${activeTab === 'region' ? 'bg-indigo-50 text-indigo-700 border-indigo-100 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 border-transparent'}`}
          >
            <Globe size={18} />
            Language & Region
          </button>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-2">
          <div className="glass rounded-3xl border border-white/40 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/5 to-cyan-400/5 blur-[100px] rounded-full pointer-events-none -mr-40 -mt-40"></div>
            
            {activeTab === 'profile' && (
              <form onSubmit={handleSubmit} className="p-8 relative z-10 animate-fade-in">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Edit Profile</h2>
                
                {successMsg && (
                  <div className="mb-6 bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl border border-emerald-100 text-sm font-semibold animate-fade-in flex items-center gap-2">
                    <CheckCircle size={16} />
                    {successMsg}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Admin Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Admin Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-sm"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Password <span className="text-xs font-normal text-slate-400">(Leave blank to keep current)</span></label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-sm"
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <div className="p-8 relative z-10 animate-fade-in">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Security Log</h2>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {logs.length > 0 ? logs.map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                          {log.action.includes('Delete') || log.action.includes('Removed') ? <Shield size={14} className="text-rose-500" /> : <CheckCircle size={14} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{log.action}</p>
                          <p className="text-xs text-slate-400 font-medium">{log.details}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(log.created_at).toLocaleString()}</p>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded-full border border-emerald-100">SUCCESS</span>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12">
                      <Shield className="mx-auto text-slate-100 mb-3" size={40} />
                      <p className="text-slate-500 font-medium">No security logs found yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'region' && (
              <div className="p-8 relative z-10 animate-fade-in">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Language & Region</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">System Language</label>
                    <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-sm">
                      <option>English (United States)</option>
                      <option>Spanish (Latin America)</option>
                      <option>Hindi (India)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Time Zone</label>
                    <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-sm">
                      <option>(GMT+05:30) Mumbai, New Delhi</option>
                      <option>(GMT-08:00) Pacific Time</option>
                      <option>(GMT+00:00) London</option>
                    </select>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                      <Save size={18} />
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
