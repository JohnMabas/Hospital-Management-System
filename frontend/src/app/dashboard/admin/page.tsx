'use client';

import { useEffect, useState } from 'react';
import { Users, Calendar, Activity, MessageSquare, TrendingUp, Stethoscope } from 'lucide-react';
import { Stagger, StaggerItem, ScrollReveal } from '@/components/motion';
import StatCard from '@/components/dashboard/StatCard';
import api from '@/lib/api';
import { AdminStats } from '@/types';
import { formatNaira } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  completed: '#22c55e',
  cancelled: '#ef4444',
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);

  const barData = stats ? [
    { name: 'Pending',   value: stats.appointmentsByStatus.pending,   fill: STATUS_COLORS.pending },
    { name: 'Confirmed', value: stats.appointmentsByStatus.confirmed,  fill: STATUS_COLORS.confirmed },
    { name: 'Completed', value: stats.appointmentsByStatus.completed,  fill: STATUS_COLORS.completed },
    { name: 'Cancelled', value: stats.appointmentsByStatus.cancelled,  fill: STATUS_COLORS.cancelled },
  ] : [];

  const pieData = barData.filter(d => d.value > 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading font-extrabold text-2xl text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">CareBridge Specialist Hospital — Management Overview</p>
      </div>

      {/* Stats cards */}
      <Stagger className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StaggerItem><StatCard title="Total Patients" value={stats?.totalPatients || 0} icon={Users} color="teal" /></StaggerItem>
        <StaggerItem><StatCard title="Doctors" value={stats?.totalDoctors || 0} icon={Stethoscope} color="blue" /></StaggerItem>
        <StaggerItem><StatCard title="Appointments" value={stats?.totalAppointments || 0} icon={Calendar} color="purple" /></StaggerItem>
        <StaggerItem><StatCard title="Today" value={stats?.appointmentsToday || 0} icon={Activity} color="orange" /></StaggerItem>
        <StaggerItem><StatCard title="Unread Msgs" value={stats?.unreadMessages || 0} icon={MessageSquare} color="red" /></StaggerItem>
        <StaggerItem>
          <StatCard
            title="Est. Revenue"
            value={0}
            icon={TrendingUp}
            color="green"
            animate={false}
            subtitle={stats ? formatNaira(stats.estimatedRevenue) : '₦0'}
          />
        </StaggerItem>
      </Stagger>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <ScrollReveal>
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="font-heading font-bold text-gray-900 mb-5">Appointments by Status</h2>
            {loading ? (
              <div className="h-48 skeleton rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="font-heading font-bold text-gray-900 mb-5">Status Distribution</h2>
            {loading ? (
              <div className="h-48 skeleton rounded-xl" />
            ) : pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-300">No data yet</div>
            )}
          </div>
        </ScrollReveal>
      </div>

      {/* Quick links */}
      <ScrollReveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { href: '/dashboard/admin/appointments', label: 'Manage Appointments', color: 'bg-blue-50 text-blue-700', icon: Calendar },
            { href: '/dashboard/admin/users', label: 'Manage Users', color: 'bg-primary-50 text-primary-700', icon: Users },
            { href: '/dashboard/admin/messages', label: 'View Messages', color: 'bg-red-50 text-red-600', icon: MessageSquare },
            { href: '/dashboard/admin/blog', label: 'Manage Blog', color: 'bg-green-50 text-green-700', icon: TrendingUp },
          ].map(({ href, label, color, icon: Icon }) => (
            <a key={href} href={href} className={`${color} rounded-2xl p-4 flex items-center gap-3 hover:opacity-80 transition-opacity`}>
              <Icon className="w-5 h-5 shrink-0" />
              <span className="font-semibold text-sm">{label}</span>
            </a>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}
