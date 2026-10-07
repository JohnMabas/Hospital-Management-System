'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Stethoscope, User, Calendar, Clock } from 'lucide-react';
import api from '@/lib/api';
import { Department, Doctor, TimeSlot } from '@/types';
import { formatNaira, formatDate, formatTime } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const steps = ['Department', 'Doctor', 'Date & Time', 'Confirm'];

export default function BookAppointmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [selected, setSelected] = useState({
    department: null as Department | null,
    doctor: null as Doctor | null,
    date: '',
    slot: '',
    reason: '',
  });

  useEffect(() => {
    api.get('/departments').then(r => setDepartments(r.data.data || []));
  }, []);

  const handleSelectDept = (dept: Department) => {
    setSelected(s => ({ ...s, department: dept, doctor: null, date: '', slot: '' }));
    setLoading(true);
    api.get(`/doctors?departmentId=${dept.id}`).then(r => setDoctors(r.data.data || [])).finally(() => setLoading(false));
    setStep(1);
  };

  const handleSelectDoctor = (doc: Doctor) => {
    setSelected(s => ({ ...s, doctor: doc, date: '', slot: '' }));
    setStep(2);
  };

  const handleDateChange = (date: string) => {
    setSelected(s => ({ ...s, date, slot: '' }));
    setSlots([]);
    if (selected.doctor && date) {
      setLoading(true);
      api.get(`/doctors/${selected.doctor.id}/availability?date=${date}`)
        .then(r => setSlots(r.data.data?.slots || []))
        .finally(() => setLoading(false));
    }
  };

  const handleSubmit = async () => {
    if (!selected.department || !selected.doctor || !selected.date || !selected.slot || !selected.reason) {
      toast.error('Please complete all fields');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/appointments', {
        departmentId: selected.department.id,
        doctorId: selected.doctor.id,
        appointmentDate: selected.date,
        timeSlot: selected.slot,
        reason: selected.reason,
      });
      toast.success('Appointment booked successfully!');
      router.push('/dashboard/patient/appointments');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => setStep(s => Math.max(0, s - 1));

  const slideDir = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -40 } };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-heading font-extrabold text-2xl text-gray-900 mb-6">Book an Appointment</h1>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`hidden sm:block text-sm font-medium ${i === step ? 'text-primary-700' : 'text-gray-400'}`}>{s}</span>
              {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300 hidden sm:block" />}
            </div>
          ))}
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-600 rounded-full"
            animate={{ width: `${((step) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6 min-h-64">
        <AnimatePresence mode="wait">
          {/* Step 0: Department */}
          {step === 0 && (
            <motion.div key="dept" variants={slideDir} initial="hidden" animate="visible" exit="exit">
              <h2 className="font-heading font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary-600" /> Select Department
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {departments.map(dept => (
                  <button key={dept.id} onClick={() => handleSelectDept(dept)}
                    className={`text-left p-4 rounded-xl border-2 transition-all hover:border-primary-400 hover:bg-primary-50 ${selected.department?.id === dept.id ? 'border-primary-600 bg-primary-50' : 'border-gray-200'}`}>
                    <p className="font-semibold text-gray-900">{dept.name}</p>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">{dept.description}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 1: Doctor */}
          {step === 1 && (
            <motion.div key="doctor" variants={slideDir} initial="hidden" animate="visible" exit="exit">
              <h2 className="font-heading font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-600" /> Select Doctor
              </h2>
              {loading ? (
                <div className="space-y-3">{Array(3).fill(null).map((_, i) => <div key={i} className="h-16 skeleton rounded-xl" />)}</div>
              ) : doctors.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No doctors available in this department.</p>
              ) : (
                <div className="space-y-3">
                  {doctors.map(doc => (
                    <button key={doc.id} onClick={() => handleSelectDoctor(doc)}
                      className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:border-primary-400 ${selected.doctor?.id === doc.id ? 'border-primary-600 bg-primary-50' : 'border-gray-200'}`}>
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-700 shrink-0">
                        {doc.user ? `${doc.user.firstName[0]}${doc.user.lastName[0]}` : 'DR'}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Dr. {doc.user?.firstName} {doc.user?.lastName}</p>
                        <p className="text-gray-400 text-xs">{doc.specialization} · {doc.yearsOfExperience} yrs exp</p>
                      </div>
                      <span className="text-primary-700 font-bold text-sm">{formatNaira(doc.consultationFee)}</span>
                    </button>
                  ))}
                </div>
              )}
              <button onClick={goBack} className="mt-4 text-gray-500 text-sm hover:text-gray-700">← Back</button>
            </motion.div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <motion.div key="datetime" variants={slideDir} initial="hidden" animate="visible" exit="exit">
              <h2 className="font-heading font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-600" /> Select Date &amp; Time
              </h2>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={selected.date}
                  onChange={e => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>
              {selected.date && (
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Available Time Slots
                  </label>
                  {loading ? (
                    <div className="grid grid-cols-4 gap-2">{Array(8).fill(null).map((_, i) => <div key={i} className="h-10 skeleton rounded-lg" />)}</div>
                  ) : slots.length === 0 ? (
                    <p className="text-gray-400 text-sm">No slots available for this date.</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {slots.map(slot => (
                        <motion.button
                          key={slot.time}
                          onClick={() => slot.available && setSelected(s => ({ ...s, slot: slot.time }))}
                          disabled={!slot.available}
                          whileHover={slot.available ? { scale: 1.05 } : {}}
                          whileTap={slot.available ? { scale: 0.97 } : {}}
                          className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                            selected.slot === slot.time
                              ? 'bg-primary-600 text-white shadow-glow'
                              : slot.available
                              ? 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                              : 'bg-gray-100 text-gray-300 cursor-not-allowed line-through'
                          }`}
                        >
                          {formatTime(slot.time)}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {selected.slot && (
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
                  <textarea
                    value={selected.reason}
                    onChange={e => setSelected(s => ({ ...s, reason: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                    placeholder="Briefly describe your symptoms or reason for this appointment..."
                  />
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={goBack} className="text-gray-500 text-sm hover:text-gray-700">← Back</button>
                {selected.slot && selected.reason && (
                  <button onClick={() => setStep(3)} className="ml-auto bg-primary-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-primary-700 transition-colors">
                    Review →
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <motion.div key="confirm" variants={slideDir} initial="hidden" animate="visible" exit="exit">
              <h2 className="font-heading font-bold text-lg text-gray-900 mb-5">Confirm Appointment</h2>
              <div className="space-y-3 mb-6">
                {[
                  { label: 'Department', value: selected.department?.name },
                  { label: 'Doctor', value: `Dr. ${selected.doctor?.user?.firstName} ${selected.doctor?.user?.lastName}` },
                  { label: 'Specialization', value: selected.doctor?.specialization },
                  { label: 'Date', value: selected.date ? formatDate(selected.date) : '' },
                  { label: 'Time', value: selected.slot ? formatTime(selected.slot) : '' },
                  { label: 'Consultation Fee', value: selected.doctor ? formatNaira(selected.doctor.consultationFee) : '' },
                  { label: 'Reason', value: selected.reason },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-4 py-2 border-b border-gray-50">
                    <span className="text-gray-400 text-sm w-40 shrink-0">{label}</span>
                    <span className="text-gray-900 text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={goBack} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  Edit
                </button>
                <motion.button
                  onClick={handleSubmit}
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm Booking'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
