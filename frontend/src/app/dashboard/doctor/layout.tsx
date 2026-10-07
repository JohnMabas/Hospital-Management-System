'use client';

import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AuthGuard from '@/components/dashboard/AuthGuard';
import { LayoutDashboard, Calendar, Users, ClipboardList, Settings } from 'lucide-react';

const navItems = [
  { href: '/dashboard/doctor',              label: 'Overview',          icon: LayoutDashboard },
  { href: '/dashboard/doctor/appointments', label: 'Appointments',      icon: Calendar },
  { href: '/dashboard/doctor/records',      label: 'Patient Records',   icon: ClipboardList },
  { href: '/dashboard/doctor/schedule',     label: 'My Schedule',       icon: Settings },
];

export default function DoctorDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['doctor']}>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <DashboardSidebar navItems={navItems} title="Doctor Portal" />
        <main className="flex-1 overflow-y-auto lg:p-8 p-4 pt-16 lg:pt-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
