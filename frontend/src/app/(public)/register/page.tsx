'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Heart, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const schema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().regex(/^(\+234|0)[789][01]\d{8}$/, 'Invalid Nigerian phone number').optional().or(z.literal('')),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Must contain at least one letter and one number'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuthStore();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch('password', '');
  const strength = (() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const onSubmit = async (data: FormData) => {
    try {
      const { confirmPassword, ...rest } = data;
      await registerUser({ ...rest, phone: rest.phone || undefined });
      toast.success('Account created! Welcome to CareBridge.');
      router.push('/dashboard/patient');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-xs mt-1">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-800 to-primary-600 flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white animate-heartbeat" />
            </div>
            <div>
              <p className="font-heading font-bold text-primary-700 text-lg leading-none">CareBridge</p>
              <p className="text-gray-400 text-xs">Specialist Hospital, Jos</p>
            </div>
          </div>

          <h1 className="font-heading font-extrabold text-2xl text-gray-900 mb-1">Create your account</h1>
          <p className="text-gray-500 text-sm mb-7">Book appointments and manage your health records online</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name *" error={errors.firstName?.message}>
                <input {...register('firstName')} className={inputCls} placeholder="First name" />
              </Field>
              <Field label="Last Name *" error={errors.lastName?.message}>
                <input {...register('lastName')} className={inputCls} placeholder="Last name" />
              </Field>
            </div>

            <Field label="Email Address *" error={errors.email?.message}>
              <input {...register('email')} type="email" autoComplete="email" className={inputCls} placeholder="you@example.com" />
            </Field>

            <Field label="Phone Number (Nigerian)" error={errors.phone?.message}>
              <input {...register('phone')} type="tel" className={inputCls} placeholder="+2348012345678 or 08012345678" />
            </Field>

            <Field label="Password *" error={errors.password?.message}>
              <div className="relative">
                <input {...register('password')} type={showPassword ? 'text' : 'password'} autoComplete="new-password" className={`${inputCls} pr-11`} placeholder="Min 8 chars, letter + number" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2 flex gap-1">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < strength ? ['bg-red-400','bg-orange-400','bg-yellow-400','bg-green-500'][strength-1] : 'bg-gray-200'}`} />
                  ))}
                </div>
              )}
            </Field>

            <Field label="Confirm Password *" error={errors.confirmPassword?.message}>
              <input {...register('confirmPassword')} type={showPassword ? 'text' : 'password'} autoComplete="new-password" className={inputCls} placeholder="Repeat your password" />
            </Field>

            <p className="text-xs text-gray-400">
              By registering you agree to our{' '}
              <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link> and{' '}
              <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>.
            </p>

            <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><UserPlus className="w-5 h-5" /> Create Account</>}
            </motion.button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account? <Link href="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
