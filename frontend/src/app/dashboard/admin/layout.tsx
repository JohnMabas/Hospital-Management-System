'use client';

import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AuthGuard from '@/components/dashboard/AuthGuard';
import { LayoutDashboard, Users, Calendar, MessageSquare, BookOpen, Star, Building2, Stethoscope, Settings } from 'lucide-react';

const navItems = [
  { href: '/dashboard/admin',               label: 'Overview',        icon: LayoutDashboard },
  { href: '/dashboard/admin/appointments',  label: 'Appointments',    icon: Calendar },
  { href: '/dashboard/admin/users',         label: 'Users',           icon: Users },
  { href: '/dashboard/admin/doctors',       label: 'Doctors',         icon: Stethoscope },
  { href: '/dashboard/admin/departments',   label: 'Departments',     icon: Building2 },
  { href: '/dashboard/admin/messages',      label: 'Messages',        icon: MessageSquare },
  { href: '/dashboard/admin/blog',          label: 'Health Tips',     icon: BookOpen },
  { href: '/dashboard/admin/testimonials',  label: 'Testimonials',    icon: Star },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <DashboardSidebar navItems={navItems} title="Admin Panel" />
        <main className="flex-1 overflow-y-auto lg:p-8 p-4 pt-16 lg:pt-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
