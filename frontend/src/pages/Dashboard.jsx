import React from 'react';
import { Users, Activity, Calendar, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { name: 'Total Patients', value: '1,284', change: '+12.5%', isPositive: true, icon: <Users size={24} />, color: 'from-blue-500 to-cyan-400' },
    { name: 'Active Doctors', value: '45', change: '+2.4%', isPositive: true, icon: <Activity size={24} />, color: 'from-indigo-500 to-purple-500' },
    { name: 'Appointments Today', value: '86', change: '-4.1%', isPositive: false, icon: <Calendar size={24} />, color: 'from-emerald-400 to-teal-500' },
    { name: 'Monthly Revenue', value: '$45,200', change: '+18.2%', isPositive: true, icon: <TrendingUp size={24} />, color: 'from-orange-400 to-rose-400' },
  ];

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass rounded-2xl p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity`}></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                {stat.icon}
              </div>
              <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.change}
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-4xl font-extrabold text-slate-800 tracking-tight">{stat.value}</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-white/40 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Patient Flow Analytics</h2>
          <div className="h-72 w-full flex items-end justify-between gap-2">
            {[40, 65, 45, 80, 55, 90, 75].map((height, i) => (
              <div key={i} className="w-full bg-slate-100 rounded-t-lg relative group">
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-500 to-cyan-400 rounded-t-lg transition-all duration-700 ease-out group-hover:opacity-80 shadow-lg shadow-indigo-500/20"
                  style={{ height: `${height}%` }}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs font-medium text-slate-400 px-2">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/40 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {[
              { time: '10:42 AM', title: 'New Appointment', desc: 'Dr. Smith with John Doe' },
              { time: '09:15 AM', title: 'Patient Discharged', desc: 'Jane Smith left Ward 4' },
              { time: 'Yesterday', title: 'System Update', desc: 'Database backed up successfully' }
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 relative" border-l border-slate-100>
                {i !== 2 && <div className="absolute left-2 top-6 bottom-[-24px] w-0.5 bg-slate-100"></div>}
                <div className="w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-indigo-50 mt-1 z-10 shrink-0 shadow-sm"></div>
                <div>
                  <p className="text-xs font-bold text-indigo-500 mb-0.5">{activity.time}</p>
                  <p className="text-sm font-bold text-slate-800">{activity.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{activity.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
