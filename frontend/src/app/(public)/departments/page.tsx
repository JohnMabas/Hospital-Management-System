'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Stethoscope } from 'lucide-react';
import { ScrollReveal, Stagger, StaggerItem } from '@/components/motion';
import api from '@/lib/api';
import { Department } from '@/types';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/departments').then(res => {
      setDepartments(res.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-700 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <ScrollReveal>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl mb-4">Our Departments</h1>
            <p className="text-primary-100 text-lg max-w-xl mx-auto">
              Eight specialist departments staffed by MDCN-licensed consultants, equipped with modern diagnostic and treatment technology.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(null).map((_, i) => (
                <StaggerItem key={i}>
                  <div className="bg-white rounded-2xl p-6 shadow-card space-y-3">
                    <div className="w-12 h-12 skeleton rounded-xl" />
                    <div className="h-5 skeleton w-3/4 rounded" />
                    <div className="h-3 skeleton w-full rounded" />
                    <div className="h-3 skeleton w-5/6 rounded" />
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept) => (
                <StaggerItem key={dept.id}>
                  <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow border border-gray-100 group h-full flex flex-col"
                  >
                    <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-primary-600 transition-colors">
                      <Stethoscope className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
                    </div>
                    <h2 className="font-heading font-bold text-xl text-gray-900 mb-3">{dept.name}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-5 line-clamp-4">
                      {dept.description || 'Specialist medical services available.'}
                    </p>
                    <div className="flex items-center justify-between">
                      {dept.doctorCount !== undefined && (
                        <span className="text-xs text-primary-600 font-semibold bg-primary-50 px-3 py-1 rounded-full">
                          {dept.doctorCount} doctor{dept.doctorCount !== 1 ? 's' : ''}
                        </span>
                      )}
                      <Link
                        href={`/departments/${dept.id}`}
                        className="inline-flex items-center gap-1 text-primary-600 font-semibold text-sm hover:gap-2 transition-all ml-auto"
                      >
                        View details <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>
    </div>
  );
}
