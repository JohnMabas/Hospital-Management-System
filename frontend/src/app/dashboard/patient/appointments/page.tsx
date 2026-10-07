'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, XCircle, Filter } from 'lucide-react';
import { Stagger, StaggerItem } from '@/components/motion';
import api from '@/lib/api';
import { Appointment, AppointmentStatus } from '@/types';
import { formatDate, formatTime, getStatusColor } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const fetchAppointments = () => {
    setLoading(true);
    const params = filter ? `?status=${filter}` : '';
    api.get(`/appointments/my${params}`).then(r => setAppointments(r.data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchAppointments(); }, [filter]);

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    setCancelling(id);
    try {
      await api.patch(`/appointments/${id}/cancel`);
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch {
      toast.error('Failed to cancel appointment');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-gray-900">My Appointments</h1>
        <Link href="/dashboard/patient/book" className="bg-primary-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-primary-700 transition-colors text-sm">
          + Book New
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f.value ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array(4).fill(null).map((_, i) => <div key={i} className="h-20 skeleton rounded-2xl" />)}</div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-16 text-center">
          <Calendar className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">No appointments found.</p>
          <Link href="/dashboard/patient/book" className="mt-4 inline-block bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-colors">
            Book an appointment
          </Link>
        </div>
      ) : (
        <Stagger className="space-y-3">
          <AnimatePresence>
            {appointments.map(appt => (
              <StaggerItem key={appt.id}>
                <motion.div layout exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-2xl shadow-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-700 font-bold shrink-0">
                      {appt.doctor?.user ? `${appt.doctor.user.firstName[0]}${appt.doctor.user.lastName[0]}` : 'DR'}
                    </div>
                    <div>
                      <p className="font-heading font-bold text-gray-900">
                        Dr. {appt.doctor?.user?.firstName} {appt.doctor?.user?.lastName}
                      </p>
                      <p className="text-gray-400 text-xs">{appt.department?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="text-sm">
                      <p className="text-gray-500 text-xs">Date</p>
                      <p className="font-semibold text-gray-900">{formatDate(appt.appointmentDate, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-500 text-xs">Time</p>
                      <p className="font-semibold text-gray-900">{formatTime(appt.timeSlot)}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(appt.status)}`}>
                      {appt.status}
                    </span>
                    {['pending', 'confirmed'].includes(appt.status) && (
                      <button
                        onClick={() => handleCancel(appt.id)}
                        disabled={cancelling === appt.id}
                        className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1 disabled:opacity-50"
                      >
                        {cancelling === appt.id ? <div className="w-3 h-3 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                        Cancel
                      </button>
                    )}
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </AnimatePresence>
        </Stagger>
      )}
    </div>
  );
}
