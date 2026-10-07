'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Calendar, Clock, Award, ArrowLeft, MapPin } from 'lucide-react';
import { ScrollReveal, Stagger, StaggerItem } from '@/components/motion';
import api from '@/lib/api';
import { Doctor } from '@/types';
import { formatNaira } from '@/lib/utils';

export default function DoctorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/doctors/${id}`).then(res => {
        setDoctor(res.data.data);
      }).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="animate-pulse space-y-6">
          <div className="h-8 skeleton w-1/3 rounded" />
          <div className="h-64 skeleton rounded-2xl" />
          <div className="h-4 skeleton w-full rounded" />
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Doctor not found.</p>
        <Link href="/doctors" className="text-primary-600 mt-4 inline-block">← Back to doctors</Link>
      </div>
    );
  }

  const dayLabels: Record<string, string> = {
    monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu',
    friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-900 to-primary-700 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/doctors" className="inline-flex items-center gap-2 text-primary-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Doctors
          </Link>
          <ScrollReveal className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
            <div className="w-32 h-32 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-4xl backdrop-blur-sm">
              {doctor.user ? `${doctor.user.firstName[0]}${doctor.user.lastName[0]}` : 'DR'}
            </div>
            <div className="text-white">
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl">
                Dr. {doctor.user?.firstName} {doctor.user?.lastName}
              </h1>
              <p className="text-primary-200 text-lg mt-1">{doctor.specialization}</p>
              <div className="flex flex-wrap gap-3 mt-3">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{doctor.department?.name}</span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> {doctor.yearsOfExperience} yrs experience
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{formatNaira(doctor.consultationFee)} consultation</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              <ScrollReveal>
                <div className="bg-white rounded-2xl p-8 shadow-card">
                  <h2 className="font-heading font-bold text-xl text-gray-900 mb-4">About Dr. {doctor.user?.lastName}</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {doctor.bio || 'Experienced specialist dedicated to providing excellent patient care.'}
                  </p>
                  {doctor.licenseNumber && (
                    <div className="mt-4 p-3 bg-primary-50 rounded-xl text-sm">
                      <span className="text-gray-500">MDCN License: </span>
                      <span className="font-semibold text-primary-700">{doctor.licenseNumber}</span>
                    </div>
                  )}
                </div>
              </ScrollReveal>

              {/* Schedule */}
              {doctor.schedules && doctor.schedules.length > 0 && (
                <ScrollReveal>
                  <div className="bg-white rounded-2xl p-8 shadow-card">
                    <h2 className="font-heading font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary-600" /> Weekly Schedule
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {doctor.schedules.map((sched) => (
                        <div key={sched.id} className="bg-primary-50 rounded-xl p-3">
                          <p className="font-semibold text-primary-700 capitalize">{dayLabels[sched.dayOfWeek] || sched.dayOfWeek}</p>
                          <p className="text-gray-500 text-sm mt-1">
                            {sched.startTime.slice(0, 5)} – {sched.endTime.slice(0, 5)}
                          </p>
                          <p className="text-gray-400 text-xs">{sched.slotDurationMinutes} min slots</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <ScrollReveal>
                <div className="bg-white rounded-2xl p-6 shadow-card">
                  <h3 className="font-heading font-bold text-gray-900 mb-4">Book an Appointment</h3>
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-primary-500" />
                      <span>30-minute consultation slots</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{formatNaira(doctor.consultationFee)} consultation fee</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-primary-500" />
                      <span>CareBridge Hospital, Jos</span>
                    </div>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/dashboard/patient/book"
                      className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                      Book Appointment
                    </Link>
                  </motion.div>
                  <p className="text-gray-400 text-xs text-center mt-3">
                    Login or create a free account to book
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="bg-primary-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-primary-800 mb-2">Department</h3>
                  <p className="text-primary-700 font-bold">{doctor.department?.name}</p>
                  <Link href={`/departments/${doctor.departmentId}`} className="text-primary-600 text-sm mt-2 hover:underline inline-block">
                    View Department →
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
