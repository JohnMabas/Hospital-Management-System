'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Filter, Star } from 'lucide-react';
import { Stagger, StaggerItem, ScrollReveal } from '@/components/motion';
import api from '@/lib/api';
import { Doctor, Department } from '@/types';
import { formatNaira, getAvatarUrl } from '@/lib/utils';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDoctors = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (selectedDept) params.set('departmentId', selectedDept);
    api.get(`/doctors?${params}`).then(res => {
      setDoctors(res.data.data || []);
    }).finally(() => setLoading(false));
  }, [search, selectedDept]);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  useEffect(() => {
    api.get('/departments').then(res => setDepartments(res.data.data || []));
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-900 to-primary-700 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <ScrollReveal>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl mb-4">Our Doctors</h1>
            <p className="text-primary-100 text-lg mb-8">Meet our team of dedicated MDCN-licensed specialist consultants</p>
          </ScrollReveal>
          {/* Search and filter */}
          <ScrollReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search doctors by name..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>
              <select
                value={selectedDept}
                onChange={e => setSelectedDept(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="">All Departments</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(8).fill(null).map((_, i) => (
                <StaggerItem key={i}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-card">
                    <div className="h-48 skeleton" />
                    <div className="p-5 space-y-2">
                      <div className="h-4 skeleton w-3/4 rounded" />
                      <div className="h-3 skeleton w-1/2 rounded" />
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          ) : doctors.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-200" />
              <p className="text-lg">No doctors found matching your search.</p>
            </div>
          ) : (
            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.map((doc) => (
                <StaggerItem key={doc.id}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover overflow-hidden group transition-shadow"
                  >
                    <div className="h-48 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center overflow-hidden">
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
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-gray-500">{doc.yearsOfExperience} yrs exp</span>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <span className="text-gray-700 text-sm font-semibold">{formatNaira(doc.consultationFee)}</span>
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
        </div>
      </section>
    </div>
  );
}
