'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Stagger, StaggerItem, ScrollReveal } from '@/components/motion';
import api from '@/lib/api';
import { Service, Department } from '@/types';
import { formatNaira } from '@/lib/utils';
import { Search, Stethoscope } from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/departments').then(r => setDepartments(r.data.data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = selectedDept ? `?departmentId=${selectedDept}&limit=50` : '?limit=50';
    api.get(`/services${params}`).then(r => setServices(r.data.data || [])).finally(() => setLoading(false));
  }, [selectedDept]);

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-900 to-primary-700 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <ScrollReveal>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl mb-4">Services & Pricing</h1>
            <p className="text-primary-100 text-lg mb-8">Transparent pricing for all our medical services. All prices in Nigerian Naira (₦).</p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSelectedDept('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!selectedDept ? 'bg-white text-primary-700' : 'bg-white/20 text-white hover:bg-white/30'}`}
              >
                All
              </button>
              {departments.map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDept(d.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedDept === d.id ? 'bg-white text-primary-700' : 'bg-white/20 text-white hover:bg-white/30'}`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(9).fill(null).map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl" />)}
            </div>
          ) : (
            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map(svc => (
                <StaggerItem key={svc.id}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow border border-gray-100"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Stethoscope className="w-4 h-4 text-primary-500" />
                          <span className="text-xs text-primary-600 font-medium">{svc.department?.name}</span>
                        </div>
                        <h3 className="font-heading font-bold text-gray-900">{svc.name}</h3>
                        {svc.description && (
                          <p className="text-gray-500 text-sm mt-1 line-clamp-2">{svc.description}</p>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="font-heading font-extrabold text-primary-700 text-lg">
                          {formatNaira(svc.price)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </Stagger>
          )}

          <ScrollReveal className="mt-12 text-center">
            <div className="bg-primary-50 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="font-heading font-bold text-primary-800 text-xl mb-3">Need More Information?</h3>
              <p className="text-gray-600 mb-5 text-sm">
                Prices shown are indicative. Final pricing depends on clinical assessment. We accept NHIS and all major HMOs.
              </p>
              <Link href="/contact" className="bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors inline-block">
                Contact Us
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
