'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X, Heart, ChevronDown, Phone } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { navbarVariants, mobileMenuVariants, backdropVariants } from '@/lib/motion';
import toast from 'react-hot-toast';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/departments', label: 'Departments' },
  { href: '/services', label: 'Services' },
  { href: '/doctors', label: 'Our Doctors' },
  { href: '/health-tips', label: 'Health Tips' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    return `/dashboard/${user.role}`;
  };

  return (
    <>
      {/* Emergency banner */}
      <div className="bg-primary-700 text-white text-sm py-2 px-4 text-center">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
          </span>
          <span className="font-medium">Emergency &amp; 24/7 Ambulance:</span>
          <a href="tel:+2348060001111" className="font-bold hover:underline flex items-center gap-1">
            <Phone className="w-3 h-3" />
            +234 806 000 1111
          </a>
        </div>
      </div>

      <motion.nav
        variants={prefersReduced ? {} : navbarVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-nav-blur border-b border-gray-100'
            : 'bg-white'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-glow"
              >
                <Heart className="w-5 h-5 text-white animate-heartbeat" />
              </motion.div>
              <div>
                <span className="font-heading font-bold text-primary-700 text-lg leading-none block">CareBridge</span>
                <span className="text-gray-400 text-xs leading-none">Specialist Hospital</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-3 py-2 text-sm font-medium rounded-lg transition-colors group',
                    pathname === link.href
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50'
                  )}
                >
                  {link.label}
                  {/* Animated underline */}
                  <span className={cn(
                    'absolute bottom-0 left-3 right-3 h-0.5 bg-primary-500 rounded-full transition-transform duration-200 origin-left',
                    pathname === link.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  )} />
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href={getDashboardLink()}
                    className="text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors"
                  >
                    {user.firstName}&apos;s Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-600 hover:text-primary-700 transition-colors px-3 py-2 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/register"
                      className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-glow"
                    >
                      Book Appointment
                    </Link>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              variants={prefersReduced ? {} : backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            />
            <motion.div
              variants={prefersReduced ? {} : mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-white shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <span className="font-heading font-bold text-primary-700">CareBridge</span>
                <button onClick={() => setIsMobileOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      pathname === link.href
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary-700'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="p-4 border-t border-gray-100 space-y-3">
                {isAuthenticated && user ? (
                  <>
                    <Link href={getDashboardLink()} className="block w-full text-center bg-primary-50 text-primary-700 font-semibold py-3 rounded-xl text-sm">
                      My Dashboard
                    </Link>
                    <button onClick={handleLogout} className="w-full text-sm text-gray-500 hover:text-red-500 py-2">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block w-full text-center border border-primary-200 text-primary-700 font-semibold py-3 rounded-xl text-sm hover:bg-primary-50 transition-colors">
                      Sign In
                    </Link>
                    <Link href="/register" className="block w-full text-center bg-primary-600 text-white font-semibold py-3 rounded-xl text-sm hover:bg-primary-700 transition-colors">
                      Book Appointment
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
