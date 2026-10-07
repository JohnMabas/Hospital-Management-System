'use client';

import Link from 'next/link';
import { Heart, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Stagger, StaggerItem } from '@/components/motion';

const footerLinks = {
  hospital: [
    { href: '/about', label: 'About Us' },
    { href: '/departments', label: 'Departments' },
    { href: '/doctors', label: 'Our Doctors' },
    { href: '/services', label: 'Services & Pricing' },
    { href: '/health-tips', label: 'Health Tips' },
  ],
  patient: [
    { href: '/register', label: 'Book Appointment' },
    { href: '/login', label: 'Patient Portal' },
    { href: '/services', label: 'Our Services' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/about#faq', label: 'FAQs' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <StaggerItem>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-heading font-bold text-white text-lg leading-none block">CareBridge</span>
                <span className="text-gray-400 text-xs">Specialist Hospital</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-4 text-gray-400">
              Providing compassionate, world-class healthcare to the people of Plateau State and beyond.
              Your health is our priority — 24/7, 365 days a year.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                  aria-label="Social media"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </StaggerItem>

          {/* Hospital Links */}
          <StaggerItem>
            <h3 className="font-heading font-semibold text-white mb-4">Hospital</h3>
            <ul className="space-y-2">
              {footerLinks.hospital.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-1 group">
                    <span className="w-1 h-1 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>

          {/* Patient Links */}
          <StaggerItem>
            <h3 className="font-heading font-semibold text-white mb-4">Patient Care</h3>
            <ul className="space-y-2">
              {footerLinks.patient.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-1 group">
                    <span className="w-1 h-1 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>

          {/* Contact */}
          <StaggerItem>
            <h3 className="font-heading font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm">
                <MapPin className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                <span className="text-gray-400">Plot 15, Yakubu Gowon Way, Jos North, Plateau State, Nigeria</span>
              </li>
              <li className="flex gap-3 text-sm">
                <Phone className="w-4 h-4 text-primary-400 shrink-0" />
                <div className="text-gray-400">
                  <a href="tel:+2348061234567" className="hover:text-primary-400 transition-colors block">+234 806 123 4567</a>
                  <a href="tel:+2348060001111" className="hover:text-red-400 transition-colors font-medium text-red-400">Emergency: +234 806 000 1111</a>
                </div>
              </li>
              <li className="flex gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary-400 shrink-0" />
                <a href="mailto:info@carebridge.com" className="text-gray-400 hover:text-primary-400 transition-colors">
                  info@carebridge.com
                </a>
              </li>
            </ul>

            <div className="mt-4 p-3 bg-gray-800 rounded-xl text-xs text-gray-400">
              <p className="font-medium text-gray-300 mb-1">Opening Hours</p>
              <p>OPD: Mon–Fri 8am–5pm, Sat 8am–1pm</p>
              <p>Emergency: 24/7 · Pharmacy: 24/7</p>
            </div>
          </StaggerItem>
        </Stagger>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} CareBridge Specialist Hospital, Jos. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
