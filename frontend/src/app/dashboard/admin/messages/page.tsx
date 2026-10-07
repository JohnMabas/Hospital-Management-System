'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import api from '@/lib/api';
import { ContactMessage } from '@/types';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  const fetchMessages = () => {
    setLoading(true);
    const params = filter !== '' ? `?isRead=${filter}` : '';
    api.get(`/contact${params}`).then(r => setMessages(r.data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, [filter]);

  const markRead = async (id: string) => {
    try {
      await api.patch(`/contact/${id}/read`);
      toast.success('Marked as read');
      fetchMessages();
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-gray-900 mb-6">Contact Messages</h1>

      <div className="flex gap-2 mb-6">
        {[{ label: 'All', val: '' }, { label: 'Unread', val: 'false' }, { label: 'Read', val: 'true' }].map(f => (
          <button key={f.val} onClick={() => setFilter(f.val)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f.val ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array(4).fill(null).map((_, i) => <div key={i} className="h-16 skeleton rounded-2xl" />)}</div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-16 text-center">
          <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No messages found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`bg-white rounded-2xl shadow-card overflow-hidden ${!msg.isRead ? 'border-l-4 border-primary-500' : ''}`}>
              <button onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {!msg.isRead && <span className="w-2 h-2 bg-primary-500 rounded-full" />}
                    <p className="font-heading font-bold text-gray-900 text-sm">{msg.subject}</p>
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5">{msg.name} · {msg.email} · {formatDate(msg.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!msg.isRead && (
                    <button onClick={e => { e.stopPropagation(); markRead(msg.id); }}
                      className="flex items-center gap-1 text-xs text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg hover:bg-primary-100">
                      <CheckCircle className="w-3.5 h-3.5" /> Mark read
                    </button>
                  )}
                  {expanded === msg.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </button>

              {expanded === msg.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  className="px-5 pb-5 pt-2 border-t border-gray-100">
                  {msg.phone && <p className="text-sm text-gray-500 mb-2">Phone: <span className="text-gray-700">{msg.phone}</span></p>}
                  <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{msg.message}</p>
                  <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                    className="mt-3 inline-flex items-center gap-1 text-primary-600 text-sm font-semibold hover:underline">
                    Reply via Email →
                  </a>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
