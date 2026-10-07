'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Plus, Edit2, X } from 'lucide-react';
import api from '@/lib/api';
import { Department } from '@/types';
import toast from 'react-hot-toast';

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editDept, setEditDept] = useState<Department | null>(null);
  const [form, setForm] = useState({ name: '', description: '', icon: '' });
  const [saving, setSaving] = useState(false);

  const fetchDepts = () => {
    setLoading(true);
    api.get('/departments').then(r => setDepartments(r.data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchDepts(); }, []);

  const openCreate = () => { setEditDept(null); setForm({ name: '', description: '', icon: '' }); setShowForm(true); };
  const openEdit = (d: Department) => { setEditDept(d); setForm({ name: d.name, description: d.description || '', icon: d.icon || '' }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.name) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      if (editDept) { await api.put(`/departments/${editDept.id}`, form); toast.success('Department updated'); }
      else { await api.post('/departments', form); toast.success('Department created'); }
      setShowForm(false);
      fetchDepts();
    } catch (err: any) { toast.error(err?.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-gray-900">Departments</h1>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openCreate}
          className="flex items-center gap-2 bg-primary-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors text-sm">
          <Plus className="w-4 h-4" /> Add Department
        </motion.button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8).fill(null).map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map(dept => (
            <div key={dept.id} className="bg-white rounded-2xl shadow-card p-5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-heading font-bold text-gray-900 text-sm">{dept.name}</p>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-2">{dept.description}</p>
                  {dept.doctorCount !== undefined && (
                    <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full mt-1 inline-block">{dept.doctorCount} doctors</span>
                  )}
                </div>
              </div>
              <button onClick={() => openEdit(dept)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors shrink-0">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading font-bold text-lg">{editDept ? 'Edit Department' : 'New Department'}</h3>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className={`${inputCls} resize-none`} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Icon (Lucide name)</label><input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className={inputCls} placeholder="e.g. Stethoscope" /></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 font-semibold">Cancel</button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving}
                  className="flex-1 bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
