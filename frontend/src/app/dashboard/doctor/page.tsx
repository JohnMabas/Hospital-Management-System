'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, Users, TrendingUp } from 'lucide-react';
import { Stagger, StaggerItem } from '@/components/motion';
import StatCard from '@/components/dashboard/StatCard';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Appointment } from '@/types';
import { formatDate, formatTime, getStatusColor, formatNaira } from '@/lib/utils';
import Link from 'next/link';

export default function DoctorDashboardPage() {
  const { user } = useAuthStore();
  const [todayAppts, setTodayAppts] = useState<Appointment[]>([]);
  const [allAppts, setAllAppts] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    Promise.all([
      api.get(`/appointments/doctor?date=${today}`),
      api.get('/appointments/doctor?limit=100'),
    ]).then(([todayRes, allRes]) => {
      setTodayAppts(todayRes.data.data || []);
      setAllAppts(allRes.data.data || []);
    }).finally(() => setLoading(false));
  }, [today]);

  const stats = {
    today: todayAppts.length,
    pending: allAppts.filter(a => a.status === 'pending').length,
    completed: allAppts.filter(a => a.status === 'completed').length,
    patients: new Set(allAppts.map(a => a.patientId)).size,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading font-extrabold text-2xl text-gray-900">
          Welcome, <span className="text-primary-600">Dr. {user?.lastName}</span> 👨‍⚕️
        </h1>
        <p className="text-gray-500 mt-1">Here&apos;s your schedule for today, {formatDate(today, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StaggerItem><StatCard title="Today's Appointments" value={stats.today} icon={Calendar} color="teal" /></StaggerItem>
        <StaggerItem><StatCard title="Awaiting Action" value={stats.pending} icon={Clock} color="orange" /></StaggerItem>
        <StaggerItem><StatCard title="Completed" value={stats.completed} icon={CheckCircle} color="green" /></StaggerItem>
        <StaggerItem><StatCard title="Total Patients" value={stats.patients} icon={Users} color="blue" /></StaggerItem>
      </Stagger>

      {/* Today's appointments */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-heading font-bold text-gray-900">Today&apos;s Appointments</h2>
          <Link href="/dashboard/doctor/appointments" className="text-primary-600 text-sm font-semibold hover:underline">View all →</Link>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">{Array(3).fill(null).map((_, i) => <div key={i} className="h-16 skeleton rounded-xl" />)}</div>
        ) : todayAppts.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No appointments scheduled for today.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {todayAppts.map(appt => (
              <div key={appt.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="text-center w-14 shrink-0">
                  <p className="font-bold text-primary-700">{formatTime(appt.timeSlot)}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center font-bold text-blue-700 shrink-0 text-sm">
                  {appt.patient?.user ? `${appt.patient.user.firstName[0]}${appt.patient.user.lastName[0]}` : 'PT'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{appt.patient?.user?.firstName} {appt.patient?.user?.lastName}</p>
                  <p className="text-gray-400 text-xs line-clamp-1">{appt.reason}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${getStatusColor(appt.status)}`}>
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
