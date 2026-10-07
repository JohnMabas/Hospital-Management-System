'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart, Shield, Clock, Users, Star, ChevronRight, Phone, ArrowRight, CheckCircle2, Stethoscope, Baby, Activity, Scissors, SmilePlus, FlaskConical } from 'lucide-react';
import { ScrollReveal, Stagger, StaggerItem, AnimatedCounter, Float } from '@/components/motion';
import { formatNaira } from '@/lib/utils';
import api from '@/lib/api';
import { Department, Doctor, Testimonial, BlogPost } from '@/types';
import { AnimatePresence } from 'framer-motion';

const iconMap: Record<string, React.ElementType> = {
  Stethoscope, Baby, Heart, Scissors, HeartPulse: Activity, SmilePlus, FlaskConical, ScanLine: Activity,
};

const stats = [
  { label: 'Patients Served', value: 25000, suffix: '+', icon: Users },
  { label: 'Expert Doctors', value: 45, suffix: '+', icon: Stethoscope },
  { label: 'Departments', value: 8, suffix: '', icon: Shield },
  { label: 'Years of Service', value: 15, suffix: '+', icon: Clock },
];

export default function HomePage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    Promise.all([
      api.get('/departments'),
      api.get('/doctors?limit=4'),
      api.get('/testimonials'),
      api.get('/health-tips?limit=3'),
    ]).then(([dRes, docRes, tRes, bRes]) => {
      setDepartments(dRes.data.data?.slice(0, 6) || []);
      setDoctors(docRes.data.data || []);
      setTestimonials(tRes.data.data || []);
      setBlogPosts(bRes.data.data || []);
    }).catch(() => {});
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setTestimonialIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials]);

  return (
    <div className="overflow-hidden">
      {/* ---- HERO ---- */}
      <section className="relative min-h-[92vh] bg-gradient-to-br from-primary-950 via-primary-800 to-primary-600 flex items-center overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        {/* Decorative circles */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-secondary-500/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              Now accepting new patients · Jos, Plateau State
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
            >
              Your Health,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-300">
                Our Priority
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-primary-100 text-lg leading-relaxed mb-8 max-w-xl"
            >
              CareBridge Specialist Hospital in Jos delivers compassionate, world-class medical care.
              Expert doctors, modern facilities, and 24/7 emergency services — all in the heart of Plateau State.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <motion.div
                animate={prefersReduced ? {} : { scale: [1, 1.04, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-4 rounded-2xl hover:bg-primary-50 transition-all duration-200 shadow-lg text-lg"
                >
                  <Heart className="w-5 h-5" />
                  Book Appointment
                </Link>
              </motion.div>
              <Link
                href="/departments"
                className="inline-flex items-center gap-2 border-2 border-white/30 hover:border-white text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 text-lg"
              >
                Our Services
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex flex-wrap gap-5"
            >
              {[
                'MDCN Accredited',
                '24/7 Emergency',
                'NHIS Accepted',
              ].map((text) => (
                <div key={text} className="flex items-center gap-2 text-primary-200 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  {text}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Floating card */}
          <Float className="hidden lg:block">
            <div className="relative">
              <div className="w-full aspect-square max-w-sm mx-auto bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 flex flex-col gap-5">
                {/* Mock doctor card */}
                <div className="flex items-center gap-4 p-4 bg-white/20 rounded-2xl">
                  <div className="w-12 h-12 bg-primary-200 rounded-xl flex items-center justify-center text-primary-700 font-bold text-lg">CO</div>
                  <div>
                    <p className="text-white font-semibold">Dr. C. Okonkwo</p>
                    <p className="text-primary-200 text-sm">Internal Medicine</p>
                  </div>
                  <span className="ml-auto w-2.5 h-2.5 bg-green-400 rounded-full" />
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/20 rounded-2xl">
                  <div className="w-12 h-12 bg-secondary-200 rounded-xl flex items-center justify-center text-secondary-700 font-bold text-lg">AN</div>
                  <div>
                    <p className="text-white font-semibold">Dr. A. Nwachukwu</p>
                    <p className="text-primary-200 text-sm">Paediatrics</p>
                  </div>
                  <span className="ml-auto w-2.5 h-2.5 bg-green-400 rounded-full" />
                </div>

                <div className="bg-white/20 rounded-2xl p-4">
                  <p className="text-primary-200 text-sm mb-1">Next available slot</p>
                  <p className="text-white font-bold text-lg">Today, 2:30 PM</p>
                  <p className="text-primary-200 text-sm">General Medicine</p>
                </div>

                <Link href="/register" className="block w-full text-center bg-white text-primary-700 font-bold py-3 rounded-xl hover:bg-primary-50 transition-colors">
                  Book Now →
                </Link>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg">
                ✓ Available Now
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white text-primary-700 text-xs font-bold px-3 py-2 rounded-xl shadow-lg flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                4.9/5 (1,200+ reviews)
              </div>
            </div>
          </Float>
        </div>
      </section>

      {/* ---- STATS ---- */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ label, value, suffix, icon: Icon }) => (
              <StaggerItem key={label}>
                <div className="text-center p-6 rounded-2xl hover:bg-primary-50 transition-colors group">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-4 group-hover:bg-primary-200 transition-colors">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="font-heading font-extrabold text-4xl text-primary-700">
                    <AnimatedCounter end={value} suffix={suffix} />
                  </div>
                  <p className="text-gray-500 mt-1 text-sm font-medium">{label}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---- DEPARTMENTS ---- */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-widest">Our Departments</span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-gray-900 mt-2 mb-4">
              Specialist Care Across All Disciplines
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              From general medicine to advanced surgical care, our eight fully-equipped departments
              are staffed by MDCN-licensed consultants ready to serve you.
            </p>
          </ScrollReveal>

          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(departments.length > 0 ? departments : Array(6).fill(null)).map((dept, i) => (
              <StaggerItem key={dept?.id || i}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow border border-gray-100 group"
                >
                  {dept ? (
                    <>
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors">
                        <Stethoscope className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="font-heading font-bold text-gray-900 text-lg mb-2">{dept.name}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
                        {dept.description || 'Comprehensive specialist care available.'}
                      </p>
                      <Link href={`/departments/${dept.id}`} className="inline-flex items-center gap-1 text-primary-600 font-semibold text-sm hover:gap-2 transition-all">
                        Learn more <ChevronRight className="w-4 h-4" />
                      </Link>
                    </>
                  ) : (
                    /* Skeleton */
                    <div className="space-y-3">
                      <div className="w-12 h-12 skeleton rounded-xl" />
                      <div className="h-5 skeleton w-3/4 rounded" />
                      <div className="h-3 skeleton w-full rounded" />
                      <div className="h-3 skeleton w-5/6 rounded" />
                    </div>
                  )}
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>

          <ScrollReveal className="text-center mt-10">
            <Link href="/departments" className="inline-flex items-center gap-2 border border-primary-600 text-primary-600 font-semibold px-6 py-3 rounded-xl hover:bg-primary-600 hover:text-white transition-all duration-200">
              View All Departments <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ---- FEATURED DOCTORS ---- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-widest">Our Doctors</span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-gray-900 mt-2 mb-4">
              Meet Our Expert Consultants
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our team of MDCN-licensed consultants brings world-class expertise and Nigerian warmth to every patient encounter.
            </p>
          </ScrollReveal>

          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(doctors.length > 0 ? doctors : Array(4).fill(null)).map((doc, i) => (
              <StaggerItem key={doc?.id || i}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover overflow-hidden group transition-shadow"
                >
                  {doc ? (
                    <>
                      <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center overflow-hidden">
                        <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                          {doc.user ? `${doc.user.firstName[0]}${doc.user.lastName[0]}` : 'DR'}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-heading font-bold text-gray-900">
                          Dr. {doc.user?.firstName} {doc.user?.lastName}
                        </h3>
                        <p className="text-primary-600 text-sm font-medium mt-1">{doc.specialization}</p>
                        <p className="text-gray-400 text-xs mt-1">{doc.department?.name}</p>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-gray-600 text-sm">{formatNaira(doc.consultationFee)}</span>
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            whileHover="visible"
                          >
                            <Link
                              href={`/doctors/${doc.id}`}
                              className="bg-primary-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary-700 transition-colors"
                            >
                              Book
                            </Link>
                          </motion.div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-5 space-y-3">
                      <div className="h-48 skeleton rounded-xl" />
                      <div className="h-4 skeleton w-3/4 rounded" />
                      <div className="h-3 skeleton w-1/2 rounded" />
                    </div>
                  )}
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>

          <ScrollReveal className="text-center mt-10">
            <Link href="/doctors" className="inline-flex items-center gap-2 border border-primary-600 text-primary-600 font-semibold px-6 py-3 rounded-xl hover:bg-primary-600 hover:text-white transition-all duration-200">
              See All Doctors <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ---- WHY CHOOSE US ---- */}
      <section className="py-20 bg-gradient-to-br from-primary-900 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <span className="text-primary-200 font-semibold text-sm uppercase tracking-widest">Why CareBridge?</span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white mt-2 mb-4">
              Healthcare You Can Trust
            </h2>
          </ScrollReveal>
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'MDCN Accredited', desc: 'All our doctors are fully licensed by the Medical and Dental Council of Nigeria.' },
              { icon: Clock, title: '24/7 Emergency', desc: 'Our emergency unit never sleeps. Ambulance services available round the clock.' },
              { icon: Heart, title: 'Compassionate Care', desc: 'We treat every patient with dignity, respect, and genuine concern for their wellbeing.' },
              { icon: CheckCircle2, title: 'NHIS / HMO Accepted', desc: 'We accept National Health Insurance Scheme and all major HMO providers.' },
            ].map(({ icon: Icon, title, desc }) => (
              <StaggerItem key={title}>
                <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 text-white hover:bg-white/20 transition-colors">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2">{title}</h3>
                  <p className="text-primary-200 text-sm leading-relaxed">{desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---- TESTIMONIALS ---- */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="text-center mb-12">
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-widest">Patient Stories</span>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-gray-900 mt-2">
                What Our Patients Say
              </h2>
            </ScrollReveal>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-3xl p-8 shadow-card text-center"
                >
                  <div className="flex justify-center mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < (testimonials[testimonialIndex]?.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                    &ldquo;{testimonials[testimonialIndex]?.message}&rdquo;
                  </blockquote>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
                      {testimonials[testimonialIndex]?.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">{testimonials[testimonialIndex]?.name}</p>
                      <p className="text-gray-400 text-sm">{testimonials[testimonialIndex]?.role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === testimonialIndex ? 'bg-primary-600 w-6' : 'bg-gray-300'}`}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---- HEALTH TIPS ---- */}
      {blogPosts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="text-center mb-12">
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-widest">Health Tips</span>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-gray-900 mt-2">
                Stay Informed, Stay Healthy
              </h2>
            </ScrollReveal>

            <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <StaggerItem key={post.id}>
                  <motion.div whileHover={{ y: -4 }} className="group bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover overflow-hidden transition-shadow">
                    <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                      <Heart className="w-16 h-16 text-primary-300" />
                    </div>
                    <div className="p-6">
                      {post.category && (
                        <span className="text-primary-600 text-xs font-semibold uppercase tracking-wide">{post.category}</span>
                      )}
                      <h3 className="font-heading font-bold text-gray-900 mt-2 mb-3 line-clamp-2">{post.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                      <Link href={`/health-tips/${post.slug}`} className="inline-flex items-center gap-1 text-primary-600 font-semibold text-sm group-hover:gap-2 transition-all">
                        Read more <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </Stagger>

            <ScrollReveal className="text-center mt-10">
              <Link href="/health-tips" className="inline-flex items-center gap-2 border border-primary-600 text-primary-600 font-semibold px-6 py-3 rounded-xl hover:bg-primary-600 hover:text-white transition-all duration-200">
                All Health Tips <ArrowRight className="w-4 h-4" />
              </Link>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ---- CTA BANNER ---- */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-4">
              Ready to Take Charge of Your Health?
            </h2>
            <p className="text-primary-100 text-lg mb-8">
              Book an appointment online in minutes. Choose from 8 specialist departments and 45+ doctors.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/register" className="bg-white text-primary-700 font-bold px-8 py-4 rounded-2xl hover:bg-primary-50 transition-colors text-lg inline-flex items-center gap-2">
                  <Heart className="w-5 h-5" /> Book Appointment
                </Link>
              </motion.div>
              <a href="tel:+2348061234567" className="border-2 border-white/50 hover:border-white text-white font-semibold px-8 py-4 rounded-2xl transition-colors text-lg inline-flex items-center gap-2">
                <Phone className="w-5 h-5" /> Call Us
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
