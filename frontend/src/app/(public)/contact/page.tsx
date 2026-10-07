'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { ScrollReveal, Stagger, StaggerItem } from '@/components/motion';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/contact', data);
      setSubmitted(true);
      toast.success('Message sent! We\'ll get back to you within 24 hours.');
    } catch {
      toast.error('Failed to send message. Please try again or call us directly.');
    }
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-900 to-primary-700 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <ScrollReveal>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl mb-4">Contact Us</h1>
            <p className="text-primary-100 text-lg">We&apos;re here to help. Reach out to us by any of the channels below.</p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact info */}
            <div className="space-y-6">
              <ScrollReveal>
                <h2 className="font-heading font-bold text-2xl text-gray-900">Get in Touch</h2>
              </ScrollReveal>
              <Stagger>
                {[
                  {
                    icon: MapPin,
                    title: 'Address',
                    content: 'Plot 15, Yakubu Gowon Way, Jos North, Plateau State, Nigeria',
                  },
                  {
                    icon: Phone,
                    title: 'Phone',
                    content: '+234 806 123 4567\nEmergency: +234 806 000 1111',
                    link: 'tel:+2348061234567',
                  },
                  {
                    icon: Mail,
                    title: 'Email',
                    content: 'info@carebridge.com\nappointments@carebridge.com',
                    link: 'mailto:info@carebridge.com',
                  },
                  {
                    icon: Clock,
                    title: 'Opening Hours',
                    content: 'OPD: Mon–Fri 8am–5pm\nSat: 8am–1pm\nEmergency: 24/7',
                  },
                ].map(({ icon: Icon, title, content, link }) => (
                  <StaggerItem key={title}>
                    <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-card">
                      <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{title}</p>
                        {link ? (
                          <a href={link} className="text-gray-600 text-sm whitespace-pre-line hover:text-primary-600 transition-colors">
                            {content}
                          </a>
                        ) : (
                          <p className="text-gray-600 text-sm whitespace-pre-line">{content}</p>
                        )}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              {/* Map placeholder */}
              <ScrollReveal>
                <div className="aspect-video bg-primary-50 rounded-2xl flex items-center justify-center border border-primary-100">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-primary-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Yakubu Gowon Way, Jos North</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl p-8 sm:p-10 shadow-card"
              >
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-16"
                    >
                      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                      <h3 className="font-heading font-bold text-2xl text-gray-900 mb-2">Message Sent!</h3>
                      <p className="text-gray-500">Thank you for reaching out. We will respond within 24 hours.</p>
                    </motion.div>
                  ) : (
                    <motion.form key="form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6">Send Us a Message</h2>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                          <input
                            {...register('name')}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                            placeholder="Your full name"
                          />
                          <AnimatePresence>
                            {errors.name && (
                              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-xs mt-1">
                                {errors.name.message}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                          <input
                            {...register('email')}
                            type="email"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                            placeholder="your@email.com"
                          />
                          <AnimatePresence>
                            {errors.email && (
                              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-xs mt-1">
                                {errors.email.message}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                          <input
                            {...register('phone')}
                            type="tel"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                            placeholder="+234 806 123 4567"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                          <input
                            {...register('subject')}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                            placeholder="How can we help?"
                          />
                          <AnimatePresence>
                            {errors.subject && (
                              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-xs mt-1">
                                {errors.subject.message}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                        <textarea
                          {...register('message')}
                          rows={5}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all resize-none"
                          placeholder="Tell us about your enquiry..."
                        />
                        <AnimatePresence>
                          {errors.message && (
                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-xs mt-1">
                              {errors.message.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Send Message
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
