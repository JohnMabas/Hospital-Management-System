'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, FileText, PlusCircle, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Stagger, StaggerItem } from '@/components/motion';
import StatCard from '@/components/dashboard/StatCard';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Appointment } from '@/types';
import { formatDate, formatTime, getStatusColor } from '@/lib/utils';

export default function PatientDashboardPage() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/appointments/my?limit=5').then(r => setAppointments(r.data.data || [])).finally(() => setLoading(false));
  }, []);

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading font-extrabold text-2xl text-gray-900">
          Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'},{' '}
          <span className="text-primary-600">{user?.firstName}</span> 👋
        </h1>
        <p className="text-gray-500 mt-1">Here&apos;s an overview of your health journey at CareBridge.</p>
      </div>

      {/* Stats */}
      <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StaggerItem><StatCard title="Total Appointments" value={stats.total} icon={Calendar} color="teal" /></StaggerItem>
        <StaggerItem><StatCard title="Pending" value={stats.pending} icon={Clock} color="orange" /></StaggerItem>
        <StaggerItem><StatCard title="Confirmed" value={stats.confirmed} icon={CheckCircle} color="blue" /></StaggerItem>
        <StaggerItem><StatCard title="Completed" value={stats.completed} icon={FileText} color="green" /></StaggerItem>
      </Stagger>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { href: '/dashboard/patient/book', icon: PlusCircle, label: 'Book New Appointment', desc: 'Schedule a visit with a specialist', color: 'bg-primary-600 text-white' },
          { href: '/dashboard/patient/appointments', icon: Calendar, label: 'My Appointments', desc: 'View and manage your bookings', color: 'bg-blue-50 text-blue-700' },
          { href: '/dashboard/patient/records', icon: FileText, label: 'Medical Records', desc: 'View diagnoses and prescriptions', color: 'bg-green-50 text-green-700' },
        ].map(({ href, icon: Icon, label, desc, color }) => (
          <Link key={href} href={href}>
            <motion.div whileHover={{ y: -3 }} className={`p-5 rounded-2xl ${color} shadow-card cursor-pointer`}>
              <Icon className="w-7 h-7 mb-3" />
              <p className="font-heading font-bold">{label}</p>
              <p className="text-sm opacity-70 mt-1">{desc}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Recent appointments */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-heading font-bold text-gray-900">Recent Appointments</h2>
          <Link href="/dashboard/patient/appointments" className="text-primary-600 text-sm font-semibold hover:underline">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {Array(3).fill(null).map((_, i) => <div key={i} className="h-16 skeleton rounded-xl" />)}
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No appointments yet.</p>
            <Link href="/dashboard/patient/book" className="mt-4 inline-block bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-colors">
              Book your first appointment
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {appointments.map((appt) => (
              <motion.div
                key={appt.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-700 font-bold text-sm shrink-0">
                  {appt.doctor?.user ? `${appt.doctor.user.firstName[0]}${appt.doctor.user.lastName[0]}` : 'DR'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    Dr. {appt.doctor?.user?.firstName} {appt.doctor?.user?.lastName}
                  </p>
                  <p className="text-gray-400 text-xs">{appt.department?.name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm text-gray-600">{formatDate(appt.appointmentDate, { month: 'short', day: 'numeric' })}</p>
                  <p className="text-xs text-gray-400">{formatTime(appt.timeSlot)}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${getStatusColor(appt.status)}`}>
                  {appt.status}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
