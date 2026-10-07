'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Filter, CheckCircle, XCircle, FileText } from 'lucide-react';
import api from '@/lib/api';
import { Appointment } from '@/types';
import { formatDate, formatTime, getStatusColor } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Stagger, StaggerItem } from '@/components/motion';

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchAppts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter) params.set('status', filter);
    if (dateFilter) params.set('date', dateFilter);
    api.get(`/appointments/doctor?${params}`).then(r => setAppointments(r.data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchAppts(); }, [filter, dateFilter]);

  const updateStatus = async (id: string, status: string, notes?: string) => {
    setUpdating(id);
    try {
      await api.patch(`/appointments/${id}/status`, { status, notes });
      toast.success(`Appointment ${status}`);
      fetchAppts();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-gray-900 mb-6">Appointments</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white" />
        {['', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === s ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array(4).fill(null).map((_, i) => <div key={i} className="h-20 skeleton rounded-2xl" />)}</div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-16 text-center">
          <Calendar className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400">No appointments found.</p>
        </div>
      ) : (
        <Stagger className="space-y-3">
          {appointments.map(appt => (
            <StaggerItem key={appt.id}>
              <div className="bg-white rounded-2xl shadow-card p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center font-bold text-blue-600 shrink-0 text-sm">
                      {appt.patient?.user ? `${appt.patient.user.firstName[0]}${appt.patient.user.lastName[0]}` : 'PT'}
                    </div>
                    <div>
                      <p className="font-heading font-bold text-gray-900 text-sm">
                        {appt.patient?.user?.firstName} {appt.patient?.user?.lastName}
                      </p>
                      <p className="text-gray-400 text-xs">{appt.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="text-sm text-gray-600">
                      {formatDate(appt.appointmentDate, { month: 'short', day: 'numeric' })} · {formatTime(appt.timeSlot)}
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(appt.status)}`}>
                      {appt.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {appt.status === 'pending' && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => updateStatus(appt.id, 'confirmed')}
                      disabled={updating === appt.id}
                      className="flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50">
                      {updating === appt.id ? <div className="w-3 h-3 border border-blue-300 border-t-blue-600 rounded-full animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                      Confirm
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => updateStatus(appt.id, 'cancelled')}
                      disabled={updating === appt.id}
                      className="flex items-center gap-1.5 bg-red-50 text-red-500 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50">
                      <XCircle className="w-3.5 h-3.5" /> Cancel
                    </motion.button>
                  </div>
                )}

                {appt.status === 'confirmed' && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => updateStatus(appt.id, 'completed')}
                      disabled={updating === appt.id}
                      className="flex items-center gap-1.5 bg-green-50 text-green-600 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50">
                      {updating === appt.id ? <div className="w-3 h-3 border border-green-300 border-t-green-600 rounded-full animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                      Mark as Completed
                    </motion.button>
                  </div>
                )}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
