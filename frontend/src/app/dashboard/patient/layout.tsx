'use client';

import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AuthGuard from '@/components/dashboard/AuthGuard';
import { LayoutDashboard, Calendar, FileText, User, PlusCircle } from 'lucide-react';

const navItems = [
  { href: '/dashboard/patient',          label: 'Overview',          icon: LayoutDashboard },
  { href: '/dashboard/patient/book',     label: 'Book Appointment',  icon: PlusCircle },
  { href: '/dashboard/patient/appointments', label: 'My Appointments', icon: Calendar },
  { href: '/dashboard/patient/records',  label: 'Medical Records',   icon: FileText },
  { href: '/dashboard/patient/profile',  label: 'My Profile',        icon: User },
];

export default function PatientDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['patient']}>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <DashboardSidebar navItems={navItems} title="Patient Portal" />
        <main className="flex-1 overflow-y-auto lg:p-8 p-4 pt-16 lg:pt-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
