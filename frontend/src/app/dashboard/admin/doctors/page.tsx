'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Plus, X } from 'lucide-react';
import api from '@/lib/api';
import { Doctor, Department } from '@/types';
import { formatNaira } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: 'TempPassword123!',
    departmentId: '', specialization: '', yearsOfExperience: 0, licenseNumber: '', consultationFee: 5000,
  });

  const fetchDoctors = () => {
    setLoading(true);
    api.get('/doctors?limit=50').then(r => setDoctors(r.data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDoctors();
    api.get('/departments').then(r => setDepartments(r.data.data || []));
  }, []);

  const handleCreate = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.departmentId || !form.specialization) {
      toast.error('Please fill all required fields'); return;
    }
    setSaving(true);
    try {
      await api.post('/admin/doctors', form);
      toast.success('Doctor account created!');
      setShowForm(false);
      setForm({ firstName: '', lastName: '', email: '', phone: '', password: 'TempPassword123!', departmentId: '', specialization: '', yearsOfExperience: 0, licenseNumber: '', consultationFee: 5000 });
      fetchDoctors();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create doctor');
    } finally { setSaving(false); }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-gray-900">Doctors</h1>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors text-sm">
          <Plus className="w-4 h-4" /> Add Doctor
        </motion.button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(null).map((_, i) => <div key={i} className="h-32 skeleton rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map(doc => (
            <div key={doc.id} className="bg-white rounded-2xl shadow-card p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center text-primary-700 font-bold shrink-0">
                  {doc.user ? `${doc.user.firstName[0]}${doc.user.lastName[0]}` : 'DR'}
                </div>
                <div>
                  <p className="font-heading font-bold text-gray-900 text-sm">Dr. {doc.user?.firstName} {doc.user?.lastName}</p>
                  <p className="text-primary-600 text-xs">{doc.specialization}</p>
                  <p className="text-gray-400 text-xs">{doc.department?.name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{doc.yearsOfExperience} yrs exp</span>
                <span className="font-semibold text-primary-700">{formatNaira(doc.consultationFee)}</span>
                <span className={`px-2 py-0.5 rounded-full font-semibold ${doc.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {doc.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 py-8 overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading font-bold text-lg">Add New Doctor</h3>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">First Name *</label><input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} className={inputCls} /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Last Name *</label><input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} className={inputCls} /></div>
                </div>
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Email *</label><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputCls} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Phone</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputCls} placeholder="+2348..." /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Temp Password</label><input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className={inputCls} /></div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Department *</label>
                  <select value={form.departmentId} onChange={e => setForm(f => ({ ...f, departmentId: e.target.value }))} className={inputCls}>
                    <option value="">Select department</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Specialization *</label><input value={form.specialization} onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} className={inputCls} placeholder="e.g. Internal Medicine & Primary Care" /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Years Exp</label><input type="number" value={form.yearsOfExperience} onChange={e => setForm(f => ({ ...f, yearsOfExperience: parseInt(e.target.value) }))} className={inputCls} min={0} /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">MDCN License</label><input value={form.licenseNumber} onChange={e => setForm(f => ({ ...f, licenseNumber: e.target.value }))} className={inputCls} /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Fee (₦)</label><input type="number" value={form.consultationFee} onChange={e => setForm(f => ({ ...f, consultationFee: parseInt(e.target.value) }))} className={inputCls} /></div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 font-semibold transition-colors">Cancel</button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCreate} disabled={saving}
                  className="flex-1 bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Doctor'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
