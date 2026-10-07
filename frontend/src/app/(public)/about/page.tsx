import type { Metadata } from 'next';
import { ScrollReveal, Stagger, StaggerItem, AnimatedCounter } from '@/components/motion';
import { CheckCircle2, Heart, Users, Award, MapPin } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about CareBridge Specialist Hospital, Jos — our history, mission, values, and the dedicated team serving Plateau State.',
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-700 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <ScrollReveal>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl mb-4">About CareBridge</h1>
            <p className="text-primary-100 text-lg leading-relaxed max-w-2xl mx-auto">
              Founded in 2009, CareBridge Specialist Hospital has grown to become one of the most trusted healthcare institutions in Plateau State, Nigeria — built on compassion, excellence, and community service.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Stagger className="grid md:grid-cols-2 gap-12 items-center">
            <StaggerItem>
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-widest">Our Story</span>
              <h2 className="font-heading font-bold text-3xl text-gray-900 mt-2 mb-6">
                15 Years of Healing in the Heart of Jos
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                CareBridge Specialist Hospital was founded in 2009 by a group of passionate Nigerian physicians who believed that world-class healthcare should be accessible to everyone in Plateau State. Starting with just 12 beds and 3 doctors, we have grown to a 150-bed facility with over 45 specialist consultants.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our hospital sits on Plot 15, Yakubu Gowon Way, Jos North — easily accessible from all local government areas of Plateau State. We serve patients from across the North Central zone including Benue, Nasarawa, and neighbouring states.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We are proud to be MDCN-accredited, NHIS-registered, and a member of the Association of Private Medical Practitioners of Nigeria (APMPN).
              </p>
            </StaggerItem>

            <StaggerItem>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 25000, suffix: '+', label: 'Patients Treated', icon: Users },
                  { value: 45, suffix: '+', label: 'Specialist Doctors', icon: Heart },
                  { value: 15, suffix: '', label: 'Years of Service', icon: Award },
                  { value: 150, suffix: '', label: 'Hospital Beds', icon: CheckCircle2 },
                ].map(({ value, suffix, label, icon: Icon }) => (
                  <div key={label} className="bg-primary-50 rounded-2xl p-6 text-center">
                    <Icon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                    <div className="font-heading font-extrabold text-3xl text-primary-700">
                      <AnimatedCounter end={value} suffix={suffix} />
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-gray-900">Our Mission, Vision & Values</h2>
          </ScrollReveal>
          <Stagger className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Our Mission',
                color: 'from-primary-600 to-primary-800',
                text: 'To provide accessible, compassionate, and excellent specialist healthcare to all people in Plateau State and beyond, regardless of their economic or social status.',
              },
              {
                title: 'Our Vision',
                color: 'from-secondary-500 to-secondary-700',
                text: 'To be the leading healthcare institution in North Central Nigeria, recognized for clinical excellence, innovation, patient safety, and community impact.',
              },
              {
                title: 'Our Values',
                color: 'from-accent-500 to-accent-700',
                text: 'Compassion · Excellence · Integrity · Teamwork · Innovation · Respect for Every Life',
              },
            ].map(({ title, color, text }) => (
              <StaggerItem key={title}>
                <div className="h-full">
                  <div className={`bg-gradient-to-br ${color} text-white rounded-2xl p-8 h-full`}>
                    <h3 className="font-heading font-bold text-xl mb-4">{title}</h3>
                    <p className="text-white/90 leading-relaxed">{text}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 bg-white" id="location">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <h2 className="font-heading font-bold text-3xl text-gray-900 mb-6">Find Us in Jos</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-600">Plot 15, Yakubu Gowon Way, Jos North, Plateau State, Nigeria</p>
                  </div>
                </div>
                {[
                  { label: 'OPD Hours', value: 'Monday–Friday: 8:00 AM – 5:00 PM\nSaturday: 8:00 AM – 1:00 PM' },
                  { label: 'Emergency', value: '24 hours, 7 days a week' },
                  { label: 'Pharmacy', value: '24 hours, 7 days a week' },
                ].map(({ label, value }) => (
                  <div key={label} className="pl-8">
                    <p className="font-semibold text-gray-900">{label}</p>
                    <p className="text-gray-600 whitespace-pre-line">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/contact" className="bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors inline-flex items-center gap-2">
                  Get Directions
                </Link>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="aspect-video bg-primary-50 rounded-2xl flex items-center justify-center border border-primary-100">
                <div className="text-center text-gray-500">
                  <MapPin className="w-16 h-16 text-primary-300 mx-auto mb-3" />
                  <p className="text-sm">Map: Plot 15, Yakubu Gowon Way, Jos North</p>
                  <p className="text-xs text-gray-400 mt-1">(Google Maps embed in production)</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
