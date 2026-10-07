'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Trash2, Eye, EyeOff, X } from 'lucide-react';
import api from '@/lib/api';
import { Testimonial } from '@/types';
import toast from 'react-hot-toast';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', message: '', rating: 5, isVisible: true });
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    setLoading(true);
    api.get('/testimonials').then(r => setTestimonials(r.data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    if (!form.name || !form.message) { toast.error('Name and message are required'); return; }
    setSaving(true);
    try {
      await api.post('/testimonials', form);
      toast.success('Testimonial added');
      setShowForm(false);
      setForm({ name: '', role: '', message: '', rating: 5, isVisible: true });
      fetch();
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const toggleVisible = async (id: string, current: boolean) => {
    try {
      await api.put(`/testimonials/${id}`, { isVisible: !current });
      toast.success(`Testimonial ${!current ? 'shown' : 'hidden'}`);
      fetch();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await api.delete(`/testimonials/${id}`);
      toast.success('Deleted');
      fetch();
    } catch { toast.error('Failed'); }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-gray-900">Testimonials</h1>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors text-sm">
          <Plus className="w-4 h-4" /> Add Testimonial
        </motion.button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{Array(4).fill(null).map((_, i) => <div key={i} className="h-32 skeleton rounded-2xl" />)}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {testimonials.map(t => (
            <div key={t.id} className={`bg-white rounded-2xl shadow-card p-5 ${!t.isVisible ? 'opacity-60' : ''}`}>
              <div className="flex justify-between mb-3">
                <div className="flex">{Array(5).fill(null).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                ))}</div>
                <div className="flex gap-1">
                  <button onClick={() => toggleVisible(t.id, t.isVisible)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    {t.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 text-sm italic mb-3 line-clamp-3">&ldquo;{t.message}&rdquo;</p>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                {t.role && <p className="text-gray-400 text-xs">{t.role}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading font-bold text-lg">Add Testimonial</h3>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="Full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role / Location</label>
                    <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className={inputCls} placeholder="e.g. Patient, Jos North" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={4} className={`${inputCls} resize-none`} placeholder="Patient's testimonial..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(r => (
                      <button key={r} type="button" onClick={() => setForm(f => ({ ...f, rating: r }))}
                        className={`p-1 rounded ${r <= form.rating ? 'text-yellow-400' : 'text-gray-200'}`}>
                        <Star className={`w-6 h-6 ${r <= form.rating ? 'fill-yellow-400' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.isVisible} onChange={e => setForm(f => ({ ...f, isVisible: e.target.checked }))} className="w-4 h-4 rounded text-primary-600" />
                  <span className="text-sm font-medium text-gray-700">Show on website</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition-colors font-semibold">Cancel</button>
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
