'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Eye, User } from 'lucide-react';
import { ScrollReveal } from '@/components/motion';
import api from '@/lib/api';
import { BlogPost } from '@/types';
import { formatDate } from '@/lib/utils';

export default function HealthTipDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      api.get(`/health-tips/${slug}`).then(r => setPost(r.data.data)).finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 space-y-4 animate-pulse">
        <div className="h-8 skeleton w-3/4 rounded" />
        <div className="h-4 skeleton w-1/3 rounded" />
        <div className="h-64 skeleton rounded-2xl" />
        <div className="space-y-2">
          {Array(8).fill(null).map((_, i) => <div key={i} className="h-3 skeleton rounded" />)}
        </div>
      </div>
    );
  }

  if (!post) return (
    <div className="text-center py-20">
      <p className="text-gray-400">Article not found.</p>
      <Link href="/health-tips" className="text-primary-600 mt-4 inline-block">← Back to Health Tips</Link>
    </div>
  );

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-900 to-primary-700 py-16 px-4">
        <div className="max-w-3xl mx-auto text-white">
          <Link href="/health-tips" className="inline-flex items-center gap-2 text-primary-200 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Health Tips
          </Link>
          {post.category && (
            <span className="bg-white/20 text-sm font-semibold px-3 py-1 rounded-full">{post.category}</span>
          )}
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl mt-4 mb-4 leading-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-primary-200 text-sm">
            {post.author && (
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                Dr. {post.author.firstName} {post.author.lastName}
              </span>
            )}
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDate(post.publishedAt, { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" /> {post.viewCount} views
            </span>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div
              className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-gray-900 prose-a:text-primary-600 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
          </ScrollReveal>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, i) => (
                  <span key={i} className="bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1 rounded-full">
                    #{typeof tag === 'string' ? tag.replace(/[{}"]/g, '') : tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 p-6 bg-primary-50 rounded-2xl text-center">
            <h3 className="font-heading font-bold text-primary-800 text-xl mb-2">Have a health concern?</h3>
            <p className="text-gray-600 text-sm mb-4">Our specialist doctors are ready to help. Book an appointment today.</p>
            <Link href="/register" className="bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors inline-block">
              Book Appointment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
