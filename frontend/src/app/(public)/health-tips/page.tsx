'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Eye } from 'lucide-react';
import { Stagger, StaggerItem, ScrollReveal } from '@/components/motion';
import api from '@/lib/api';
import { BlogPost } from '@/types';
import { formatDate, truncate } from '@/lib/utils';

export default function HealthTipsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/health-tips?limit=20').then(r => setPosts(r.data.data || [])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-900 to-primary-700 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <ScrollReveal>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl mb-4">Health Tips & Articles</h1>
            <p className="text-primary-100 text-lg">Expert health advice from the doctors at CareBridge Specialist Hospital</p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array(6).fill(null).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-card">
                  <div className="h-48 skeleton" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 skeleton w-1/3 rounded" />
                    <div className="h-5 skeleton w-full rounded" />
                    <div className="h-3 skeleton w-5/6 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-400 py-16">No articles published yet.</p>
          ) : (
            <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map(post => (
                <StaggerItem key={post.id}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover overflow-hidden group transition-shadow h-full flex flex-col"
                  >
                    <div className="h-48 bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
                      <svg viewBox="0 0 80 80" className="w-20 h-20 opacity-30">
                        <circle cx="40" cy="40" r="38" fill="#14b8a6" />
                        <path d="M30 40h20M40 30v20" stroke="white" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-3">
                        {post.category && (
                          <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-1 rounded-full">{post.category}</span>
                        )}
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {post.viewCount}
                        </span>
                      </div>
                      <h2 className="font-heading font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.publishedAt ? formatDate(post.publishedAt, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                        </span>
                        <Link href={`/health-tips/${post.slug}`} className="inline-flex items-center gap-1 text-primary-600 font-semibold text-sm group-hover:gap-2 transition-all">
                          Read <ArrowRight className="w-4 h-4" />
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
