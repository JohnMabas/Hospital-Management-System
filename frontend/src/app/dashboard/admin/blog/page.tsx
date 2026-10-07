'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Edit2, Trash2, Eye, EyeOff, X } from 'lucide-react';
import api from '@/lib/api';
import { BlogPost } from '@/types';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', category: '', isPublished: false });
  const [saving, setSaving] = useState(false);

  const fetchPosts = () => {
    setLoading(true);
    // Admin gets all posts including unpublished - use a custom param workaround
    api.get('/health-tips?limit=50').then(r => setPosts(r.data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, []);

  const openCreate = () => {
    setEditPost(null);
    setForm({ title: '', excerpt: '', content: '', category: '', isPublished: false });
    setShowForm(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditPost(post);
    setForm({ title: post.title, excerpt: post.excerpt || '', content: post.content || '', category: post.category || '', isPublished: post.isPublished });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.content) { toast.error('Title and content are required'); return; }
    setSaving(true);
    try {
      if (editPost) {
        await api.put(`/health-tips/${editPost.id}`, form);
        toast.success('Post updated!');
      } else {
        await api.post('/health-tips', form);
        toast.success('Post created!');
      }
      setShowForm(false);
      fetchPosts();
    } catch { toast.error('Failed to save post'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post permanently?')) return;
    try {
      await api.delete(`/health-tips/${id}`);
      toast.success('Post deleted');
      fetchPosts();
    } catch { toast.error('Failed to delete'); }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-gray-900">Health Tips / Blog</h1>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openCreate}
          className="flex items-center gap-2 bg-primary-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors text-sm">
          <Plus className="w-4 h-4" /> New Post
        </motion.button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array(4).fill(null).map((_, i) => <div key={i} className="h-16 skeleton rounded-2xl" />)}</div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-16 text-center">
          <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No posts yet. Create your first health tip!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50"><tr>
                {['Title', 'Category', 'Published', 'Views', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 max-w-xs truncate">{post.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{post.category || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${post.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {post.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{post.viewCount}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{post.publishedAt ? formatDate(post.publishedAt, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(post)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(post.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 py-8 overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading font-bold text-lg text-gray-900">{editPost ? 'Edit Post' : 'New Health Tip'}</h3>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} placeholder="Article title" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputCls} placeholder="e.g. Maternal Health, Cardiology" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt / Summary</label>
                  <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2} className={`${inputCls} resize-none`} placeholder="Brief summary (shown in list view)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content * (HTML supported)</label>
                  <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={8} className={`${inputCls} resize-none font-mono text-xs`} placeholder="Full article content (HTML or plain text)" />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} className="w-4 h-4 text-primary-600 rounded" />
                  <span className="text-sm font-medium text-gray-700">Publish immediately</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition-colors font-semibold">Cancel</button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving}
                  className="flex-1 bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (editPost ? 'Update Post' : 'Create Post')}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
