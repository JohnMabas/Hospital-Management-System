'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Stethoscope, ArrowLeft, Users, Clock, CheckCircle2,
  ChevronRight, Phone, Star, Award, Calendar,
} from 'lucide-react';
import { ScrollReveal, Stagger, StaggerItem, Float } from '@/components/motion';
import api from '@/lib/api';
import { Department, Doctor, Service } from '@/types';
import { formatNaira } from '@/lib/utils';
import type { Metadata } from 'next';

export default function DepartmentDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [department, setDepartment] = useState<Department | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    Promise.all([
      api.get(`/departments/${id}`),
      api.get(`/doctors?departmentId=${id}`),
      api.get(`/services?departmentId=${id}`),
    ])
      .then(([deptRes, docRes, svcRes]) => {
        setDepartment(deptRes.data.data || null);
        setDoctors(docRes.data.data || []);
        setServices(svcRes.data.data || []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero skeleton */}
        <div className="bg-gradient-to-br from-primary-900 to-primary-700 py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="h-4 skeleton w-32 rounded mb-6" />
            <div className="h-12 skeleton w-2/3 rounded mb-4" />
            <div className="h-5 skeleton w-full rounded mb-2" />
            <div className="h-5 skeleton w-5/6 rounded" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {Array(4).fill(null).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-card h-48 skeleton" />
              ))}
            </div>
            <div className="space-y-4">
              {Array(3).fill(null).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-card h-32 skeleton" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <Stethoscope className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h1 className="font-heading font-bold text-2xl text-gray-900 mb-2">Department not found</h1>
          <p className="text-gray-500 mb-6">This department may not exist or may have been removed.</p>
          <Link
            href="/departments"
            className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Departments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ---- HERO ---- */}
      <section className="relative bg-gradient-to-br from-primary-950 via-primary-800 to-primary-600 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-primary-200 text-sm mb-6"
          >
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/departments" className="hover:text-white transition-colors">Departments</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">{department.name}</span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-5"
              >
                <Stethoscope className="w-4 h-4" />
                MDCN-Accredited Department
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-4 leading-tight"
              >
                {department.name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-primary-100 text-lg leading-relaxed mb-8"
              >
                {department.description || 'Providing specialist medical care with experienced consultants and modern equipment.'}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-7 py-3.5 rounded-2xl hover:bg-primary-50 transition-all shadow-lg text-base"
                >
                  <Calendar className="w-5 h-5" />
                  Book Appointment
                </Link>
                <a
                  href="tel:+2348060001111"
                  className="inline-flex items-center gap-2 border-2 border-white/30 hover:border-white text-white font-semibold px-7 py-3.5 rounded-2xl transition-all text-base"
                >
                  <Phone className="w-5 h-5" />
                  Call Us
                </a>
              </motion.div>
            </div>

            {/* Stats card */}
            <Float className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-white">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'Specialist Doctors', value: doctors.length, icon: Users },
                    { label: 'Services Available', value: services.length, icon: CheckCircle2 },
                    { label: 'Years Experience', value: '15+', icon: Award },
                    { label: 'Hours of Operation', value: '24/7', icon: Clock },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="text-center p-4 bg-white/10 rounded-2xl">
                      <Icon className="w-6 h-6 mx-auto mb-2 text-primary-200" />
                      <div className="font-heading font-extrabold text-2xl">{value}</div>
                      <div className="text-primary-200 text-xs mt-1">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Float>
          </div>
        </div>
      </section>

      {/* ---- MAIN CONTENT ---- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ---- LEFT: Doctors + Services ---- */}
          <div className="lg:col-span-2 space-y-10">

            {/* Our Doctors */}
            <section>
              <ScrollReveal>
                <h2 className="font-heading font-bold text-2xl text-gray-900 mb-2 flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary-600" />
                  Our Specialist Doctors
                </h2>
                <p className="text-gray-500 mb-6">
                  MDCN-licensed consultants in {department.name} available for in-person and virtual consultations.
                </p>
              </ScrollReveal>

              {doctors.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-card p-12 text-center">
                  <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400">No doctors listed for this department yet.</p>
                </div>
              ) : (
                <Stagger className="grid sm:grid-cols-2 gap-5">
                  {doctors.map((doc) => (
                    <StaggerItem key={doc.id}>
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-white rounded-2xl shadow-card hover:shadow-card-hover border border-gray-100 overflow-hidden transition-shadow group"
                      >
                        {/* Doctor avatar area */}
                        <div className="h-32 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center relative overflow-hidden">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                            className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                          >
                            {doc.user
                              ? `${doc.user.firstName[0]}${doc.user.lastName[0]}`
                              : 'DR'}
                          </motion.div>
                          {doc.isAvailable && (
                            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                              Available
                            </div>
                          )}
                        </div>

                        <div className="p-5">
                          <h3 className="font-heading font-bold text-gray-900 text-base">
                            Dr. {doc.user?.firstName} {doc.user?.lastName}
                          </h3>
                          <p className="text-primary-600 text-sm font-medium mt-0.5">{doc.specialization}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            ))}
                            <span className="text-gray-400 text-xs ml-1">4.9</span>
                          </div>

                          <div className="flex items-center gap-1 mt-2 text-gray-500 text-xs">
                            <Award className="w-3.5 h-3.5" />
                            {doc.yearsOfExperience} years experience
                          </div>

                          {doc.bio && (
                            <p className="text-gray-400 text-xs mt-2 line-clamp-2">{doc.bio}</p>
                          )}

                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                            <span className="text-gray-700 font-semibold text-sm">
                              {formatNaira(doc.consultationFee)}
                            </span>
                            <Link
                              href={`/doctors/${doc.id}`}
                              className="bg-primary-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                            >
                              View Profile
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </Stagger>
              )}
            </section>

            {/* Services */}
            {services.length > 0 && (
              <section>
                <ScrollReveal>
                  <h2 className="font-heading font-bold text-2xl text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-primary-600" />
                    Services & Procedures
                  </h2>
                  <p className="text-gray-500 mb-6">
                    All prices are in Nigerian Naira (₦). NHIS and major HMOs accepted.
                  </p>
                </ScrollReveal>

                <Stagger className="space-y-3">
                  {services.map((svc) => (
                    <StaggerItem key={svc.id}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="bg-white rounded-2xl shadow-card p-5 flex items-center justify-between border border-gray-100 hover:border-primary-200 transition-colors group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary-600 transition-colors">
                            <CheckCircle2 className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">{svc.name}</h3>
                            {svc.description && (
                              <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">{svc.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <span className="font-heading font-bold text-primary-700 text-base">
                            {formatNaira(svc.price)}
                          </span>
                        </div>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </Stagger>
              </section>
            )}

            {/* What to expect */}
            <section>
              <ScrollReveal>
                <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-primary-600" />
                  What to Expect
                </h2>
              </ScrollReveal>
              <Stagger className="grid sm:grid-cols-3 gap-5">
                {[
                  {
                    step: '1',
                    title: 'Book Your Appointment',
                    desc: 'Choose your preferred doctor and available time slot online or by phone.',
                    color: 'bg-blue-50 border-blue-200',
                    iconColor: 'bg-blue-100 text-blue-600',
                  },
                  {
                    step: '2',
                    title: 'See the Consultant',
                    desc: 'Visit the department at your scheduled time. Please arrive 15 minutes early.',
                    color: 'bg-primary-50 border-primary-200',
                    iconColor: 'bg-primary-100 text-primary-600',
                  },
                  {
                    step: '3',
                    title: 'Get Your Care Plan',
                    desc: 'Receive diagnosis, prescription, lab referrals, and follow-up scheduling.',
                    color: 'bg-green-50 border-green-200',
                    iconColor: 'bg-green-100 text-green-600',
                  },
                ].map(({ step, title, desc, color, iconColor }) => (
                  <StaggerItem key={step}>
                    <div className={`rounded-2xl border p-5 ${color}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg mb-4 ${iconColor}`}>
                        {step}
                      </div>
                      <h3 className="font-heading font-bold text-gray-900 text-sm mb-2">{title}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </section>
          </div>

          {/* ---- RIGHT SIDEBAR ---- */}
          <div className="space-y-5">
            {/* Quick book card */}
            <ScrollReveal>
              <div className="bg-primary-600 rounded-2xl p-6 text-white sticky top-20">
                <h3 className="font-heading font-bold text-lg mb-2">Book an Appointment</h3>
                <p className="text-primary-100 text-sm mb-5 leading-relaxed">
                  Schedule a consultation with one of our {department.name} specialists today.
                </p>
                <Link
                  href="/dashboard/patient/book"
                  className="block w-full text-center bg-white text-primary-700 font-bold py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm"
                >
                  Book Now →
                </Link>
                <div className="mt-4 pt-4 border-t border-primary-500">
                  <p className="text-primary-200 text-xs mb-2">Need urgent help?</p>
                  <a
                    href="tel:+2348060001111"
                    className="flex items-center gap-2 text-white font-bold text-sm hover:text-primary-100 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    +234 806 000 1111
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Operating hours */}
            <ScrollReveal delay={0.1}>
              <div className="bg-white rounded-2xl shadow-card p-5 border border-gray-100">
                <h3 className="font-heading font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary-600" />
                  Operating Hours
                </h3>
                <div className="space-y-2.5">
                  {[
                    { day: 'Mon – Fri', hours: '8:00 AM – 5:00 PM' },
                    { day: 'Saturday', hours: '8:00 AM – 2:00 PM' },
                    { day: 'Sunday', hours: 'Emergencies Only' },
                    { day: 'Emergency', hours: '24 / 7' },
                  ].map(({ day, hours }) => (
                    <div key={day} className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">{day}</span>
                      <span className={`font-semibold ${day === 'Emergency' ? 'text-green-600' : 'text-gray-900'}`}>
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* NHIS notice */}
            <ScrollReveal delay={0.2}>
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-800 text-sm mb-1">NHIS & HMO Accepted</h3>
                    <p className="text-green-700 text-xs leading-relaxed">
                      We accept the National Health Insurance Scheme and all major HMO providers in Nigeria.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Other departments */}
            <ScrollReveal delay={0.3}>
              <div className="bg-white rounded-2xl shadow-card p-5 border border-gray-100">
                <h3 className="font-heading font-semibold text-gray-900 mb-4">Other Departments</h3>
                <div className="space-y-1">
                  <Link
                    href="/departments"
                    className="flex items-center gap-2 text-sm text-primary-600 font-medium hover:text-primary-700 py-1.5"
                  >
                    <Stethoscope className="w-4 h-4" />
                    View all departments
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* ---- CTA FOOTER ---- */}
      <section className="bg-gray-100 border-t border-gray-200 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="font-heading font-bold text-2xl text-gray-900 mb-3">
              Ready to see a specialist?
            </h2>
            <p className="text-gray-500 mb-6">
              Book an appointment with a {department.name} consultant at CareBridge Specialist Hospital today.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/register"
                className="bg-primary-600 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-primary-700 transition-colors"
              >
                Create Account & Book
              </Link>
              <Link
                href="/doctors"
                className="border border-gray-300 text-gray-700 font-semibold px-8 py-3.5 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                Browse All Doctors
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
