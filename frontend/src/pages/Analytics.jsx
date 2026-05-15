import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Users, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/analytics', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#6366f1', '#2dd4bf', '#f43f5e', '#f59e0b'];

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Analytics & Reports</h1>
        <p className="text-slate-500 mt-1">Deep dive into clinic performance and patient metrics.</p>
      </div>

      <div className="glass rounded-2xl p-6 border border-white/40 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Activity className="text-emerald-500" size={20} />
          Key Performance Indicators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-4 bg-white rounded-xl border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Patients</p>
              <p className="text-xl font-bold text-slate-800">{data.kpis.totalPatients}</p>
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-xl border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Doctors</p>
              <p className="text-xl font-bold text-slate-800">{data.kpis.totalDoctors}</p>
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-xl border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-full flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Appointments Today</p>
              <p className="text-xl font-bold text-slate-800">{data.kpis.todayAppointments}</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Monthly Revenue</p>
              <p className="text-xl font-bold text-slate-800">{data.kpis.revenue}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6 border border-white/40 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="text-indigo-500" size={20} />
            Appointments by Status
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.charts.appointmentsByStatus} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40}>
                  {data.charts.appointmentsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/40 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Users className="text-cyan-500" size={20} />
            Patient Demographics (Gender)
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.charts.patientsByGender}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.charts.patientsByGender.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Analytics;
