'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, PlusCircle, X } from 'lucide-react';
import api from '@/lib/api';
import { Appointment, MedicalRecord } from '@/types';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function DoctorRecordsPage() {
  const [completedAppts, setCompletedAppts] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [form, setForm] = useState({ diagnosis: '', prescription: '', notes: '', followUpDate: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/appointments/doctor?status=completed').then(r => setCompletedAppts(r.data.data || []));
  }, []);

  const handleCreate = async () => {
    if (!selectedAppt || !form.diagnosis) return;
    setSubmitting(true);
    try {
      await api.post('/medical-records', {
        patientId: selectedAppt.patientId,
        appointmentId: selectedAppt.id,
        ...form,
      });
      toast.success('Medical record created');
      setShowForm(false);
      setForm({ diagnosis: '', prescription: '', notes: '', followUpDate: '' });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create record');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-gray-900">Patient Records</h1>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors text-sm">
          <PlusCircle className="w-4 h-4" /> New Record
        </motion.button>
      </div>

      {/* Completed appointments (for which records can be created) */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-heading font-semibold text-gray-700 text-sm">Completed Appointments — click to add a record</h2>
        </div>
        {completedAppts.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No completed appointments yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {completedAppts.map(appt => (
              <button key={appt.id} onClick={() => { setSelectedAppt(appt); setShowForm(true); }}
                className="w-full text-left px-6 py-4 flex items-center gap-4 hover:bg-primary-50 transition-colors">
                <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center font-bold text-primary-700 text-xs shrink-0">
                  {appt.patient?.user ? `${appt.patient.user.firstName[0]}${appt.patient.user.lastName[0]}` : 'PT'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{appt.patient?.user?.firstName} {appt.patient?.user?.lastName}</p>
                  <p className="text-gray-400 text-xs">{formatDate(appt.appointmentDate, { month: 'short', day: 'numeric', year: 'numeric' })} · {appt.reason}</p>
                </div>
                <PlusCircle className="w-4 h-4 text-primary-400" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* New record modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading font-bold text-lg text-gray-900">New Medical Record</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            {selectedAppt && (
              <div className="bg-primary-50 rounded-xl p-3 mb-5 text-sm text-primary-800">
                Patient: <strong>{selectedAppt.patient?.user?.firstName} {selectedAppt.patient?.user?.lastName}</strong>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis *</label>
                <textarea value={form.diagnosis} onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))} rows={2} className={`${inputCls} resize-none`} placeholder="Primary diagnosis..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prescription</label>
                <textarea value={form.prescription} onChange={e => setForm(f => ({ ...f, prescription: e.target.value }))} rows={3} className={`${inputCls} resize-none`} placeholder="Medications, dosage, frequency..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor&apos;s Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className={`${inputCls} resize-none`} placeholder="Additional notes..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                <input type="date" value={form.followUpDate} onChange={e => setForm(f => ({ ...f, followUpDate: e.target.value }))} className={inputCls} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition-colors font-semibold">Cancel</button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleCreate} disabled={submitting || !form.diagnosis}
                className="flex-1 bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save Record'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
