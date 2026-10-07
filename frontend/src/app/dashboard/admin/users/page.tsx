'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import api from '@/lib/api';
import { User } from '@/types';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (roleFilter) params.set('role', roleFilter);
    api.get(`/admin/users?${params}`).then(r => setUsers(r.data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [search, roleFilter]);

  const toggleActive = async (userId: string) => {
    setToggling(userId);
    try {
      await api.patch(`/admin/users/${userId}/toggle-active`);
      toast.success('User status updated');
      fetchUsers();
    } catch {
      toast.error('Failed to update user');
    } finally {
      setToggling(null);
    }
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-700',
    doctor: 'bg-blue-100 text-blue-700',
    patient: 'bg-green-100 text-green-700',
    receptionist: 'bg-orange-100 text-orange-700',
  };

  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-gray-900 mb-6">Users Management</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
            className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white" />
        </div>
        {['', 'patient', 'doctor', 'admin'].map(r => (
          <button key={r} onClick={() => setRoleFilter(r)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${roleFilter === r ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {r || 'All'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{Array(6).fill(null).map((_, i) => <div key={i} className="h-12 skeleton rounded-xl" />)}</div>
        ) : users.length === 0 ? (
          <div className="p-16 text-center"><Users className="w-12 h-12 text-gray-200 mx-auto mb-3" /><p className="text-gray-400">No users found.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>{['Name', 'Email', 'Phone', 'Role', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xs shrink-0">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{user.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${roleColors[user.role] || 'bg-gray-100 text-gray-600'}`}>{user.role}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{formatDate(user.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.role !== 'admin' && (
                        <button onClick={() => toggleActive(user.id)} disabled={toggling === user.id}
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600 transition-colors disabled:opacity-50">
                          {toggling === user.id ? <div className="w-3 h-3 border border-gray-300 border-t-gray-600 rounded-full animate-spin" /> :
                            (user.isActive ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4 text-gray-400" />)}
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
