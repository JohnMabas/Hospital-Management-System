'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Save, Plus, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

interface ScheduleEntry {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
}

export default function DoctorSchedulePage() {
  const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/doctors/me/profile').then(r => {
      const s = r.data.data?.schedules || [];
      setSchedules(s.map((x: any) => ({
        dayOfWeek: x.dayOfWeek,
        startTime: x.startTime?.slice(0, 5) || '09:00',
        endTime: x.endTime?.slice(0, 5) || '17:00',
        slotDurationMinutes: x.slotDurationMinutes || 30,
      })));
    });
  }, []);

  const addDay = () => setSchedules(s => [...s, { dayOfWeek: 'monday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30 }]);
  const removeDay = (i: number) => setSchedules(s => s.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof ScheduleEntry, value: string | number) => {
    setSchedules(s => s.map((entry, idx) => idx === i ? { ...entry, [field]: value } : entry));
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/doctors/me/schedule', { schedules });
      toast.success('Schedule updated!');
    } catch {
      toast.error('Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white";

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-gray-900">My Schedule</h1>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={addDay}
          className="flex items-center gap-2 bg-primary-50 text-primary-700 font-semibold px-4 py-2 rounded-xl hover:bg-primary-100 transition-colors text-sm">
          <Plus className="w-4 h-4" /> Add Day
        </motion.button>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
        {schedules.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-200" />
            <p>No schedule configured yet. Click &ldquo;Add Day&rdquo; to start.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {schedules.map((entry, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <select value={entry.dayOfWeek} onChange={e => update(i, 'dayOfWeek', e.target.value)} className={`${inputCls} capitalize w-36`}>
                  {DAYS.map(d => <option key={d} value={d} className="capitalize">{d}</option>)}
                </select>
                <input type="time" value={entry.startTime} onChange={e => update(i, 'startTime', e.target.value)} className={inputCls} />
                <span className="text-gray-400 text-sm">to</span>
                <input type="time" value={entry.endTime} onChange={e => update(i, 'endTime', e.target.value)} className={inputCls} />
                <select value={entry.slotDurationMinutes} onChange={e => update(i, 'slotDurationMinutes', parseInt(e.target.value))} className={inputCls}>
                  {[15, 20, 30, 45, 60].map(m => <option key={m} value={m}>{m} min</option>)}
                </select>
                <button onClick={() => removeDay(i)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={save} disabled={saving}
        className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
        {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-5 h-5" /> Save Schedule</>}
      </motion.button>
    </div>
  );
}
