'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Stagger, StaggerItem } from '@/components/motion';
import api from '@/lib/api';
import { MedicalRecord } from '@/types';
import { formatDate } from '@/lib/utils';

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    api.get('/medical-records/my').then(r => setRecords(r.data.data || [])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-gray-900 mb-6">Medical Records</h1>

      {loading ? (
        <div className="space-y-3">{Array(3).fill(null).map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}</div>
      ) : records.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-16 text-center">
          <FileText className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">No medical records yet.</p>
          <p className="text-gray-300 text-sm mt-1">Records will appear here after a completed appointment.</p>
        </div>
      ) : (
        <Stagger className="space-y-3">
          {records.map(record => (
            <StaggerItem key={record.id}>
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === record.id ? null : record.id)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-700 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-heading font-bold text-gray-900 line-clamp-1">{record.diagnosis}</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Dr. {record.doctor?.user?.firstName} {record.doctor?.user?.lastName} · {formatDate(record.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  {expanded === record.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>

                {expanded === record.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 pb-5 border-t border-gray-100"
                  >
                    <div className="pt-4 grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Diagnosis</p>
                        <p className="text-gray-800 text-sm">{record.diagnosis}</p>
                      </div>
                      {record.prescription && (
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Prescription</p>
                          <p className="text-gray-800 text-sm whitespace-pre-line">{record.prescription}</p>
                        </div>
                      )}
                      {record.notes && (
                        <div className="sm:col-span-2">
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Doctor&apos;s Notes</p>
                          <p className="text-gray-800 text-sm">{record.notes}</p>
                        </div>
                      )}
                      {record.followUpDate && (
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Follow-up Date</p>
                          <p className="text-primary-700 font-semibold text-sm">{formatDate(record.followUpDate, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
