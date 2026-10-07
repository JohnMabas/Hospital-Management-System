'use client';

import { useEffect, useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import api from '@/lib/api';
import { Appointment } from '@/types';
import { formatDate, formatTime, getStatusColor } from '@/lib/utils';
import { Stagger, StaggerItem } from '@/components/motion';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = filter ? `?status=${filter}` : '';
    api.get(`/appointments/admin${params}`).then(r => setAppointments(r.data.data || [])).finally(() => setLoading(false));
  }, [filter]);

  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-gray-900 mb-6">All Appointments</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {['', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === s ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{Array(5).fill(null).map((_, i) => <div key={i} className="h-14 skeleton rounded-xl" />)}</div>
        ) : appointments.length === 0 ? (
          <div className="p-16 text-center"><Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" /><p className="text-gray-400">No appointments found.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>{['Patient', 'Doctor', 'Department', 'Date', 'Time', 'Reason', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.map(appt => (
                  <tr key={appt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{appt.patient?.user?.firstName} {appt.patient?.user?.lastName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Dr. {appt.doctor?.user?.firstName} {appt.doctor?.user?.lastName}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{appt.department?.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(appt.appointmentDate, { month: 'short', day: 'numeric' })}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatTime(appt.timeSlot)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{appt.reason}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(appt.status)}`}>{appt.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
