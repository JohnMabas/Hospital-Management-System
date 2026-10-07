'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import api from '@/lib/api';
import { NIGERIAN_STATES, BLOOD_GROUPS, GENOTYPES } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function PatientProfilePage() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    api.get('/patients/profile').then(r => {
      const p = r.data.data;
      reset({
        firstName: p.user?.firstName,
        lastName: p.user?.lastName,
        phone: p.user?.phone,
        dateOfBirth: p.dateOfBirth,
        gender: p.gender,
        bloodGroup: p.bloodGroup,
        genotype: p.genotype,
        address: p.address,
        state: p.state,
        lga: p.lga,
        emergencyContactName: p.emergencyContactName,
        emergencyContactPhone: p.emergencyContactPhone,
        nhisNumber: p.nhisNumber,
      });
    });
  }, [reset]);

  const onSubmit = async (data: any) => {
    try {
      await api.put('/patients/profile', data);
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all bg-white";
  const selectCls = `${inputCls} cursor-pointer`;

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
      <h2 className="font-heading font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">{title}</h2>
      {children}
    </div>
  );

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading font-extrabold text-2xl text-gray-900 mb-6">My Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Section title="Personal Information">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">First Name</label><input {...register('firstName')} className={inputCls} /></div>
            <div><label className="label">Last Name</label><input {...register('lastName')} className={inputCls} /></div>
            <div><label className="label">Phone</label><input {...register('phone')} className={inputCls} placeholder="+2348012345678" /></div>
            <div><label className="label">Date of Birth</label><input type="date" {...register('dateOfBirth')} className={inputCls} /></div>
            <div>
              <label className="label">Gender</label>
              <select {...register('gender')} className={selectCls}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Blood Group</label>
              <select {...register('bloodGroup')} className={selectCls}>
                <option value="">Select</option>
                {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Genotype</label>
              <select {...register('genotype')} className={selectCls}>
                <option value="">Select</option>
                {GENOTYPES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="label">NHIS / HMO Number</label>
              <input {...register('nhisNumber')} className={inputCls} placeholder="Optional" />
            </div>
          </div>
        </Section>

        <Section title="Address">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="label">Address</label><input {...register('address')} className={inputCls} placeholder="Street address" /></div>
            <div>
              <label className="label">State</label>
              <select {...register('state')} className={selectCls}>
                <option value="">Select state</option>
                {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div><label className="label">LGA</label><input {...register('lga')} className={inputCls} placeholder="Local Government Area" /></div>
          </div>
        </Section>

        <Section title="Emergency Contact">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Contact Name</label><input {...register('emergencyContactName')} className={inputCls} /></div>
            <div><label className="label">Contact Phone</label><input {...register('emergencyContactPhone')} className={inputCls} placeholder="+2348012345678" /></div>
          </div>
        </Section>

        <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
          {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-5 h-5" /> Save Profile</>}
        </motion.button>
      </form>

      <style jsx>{`
        .label { display: block; font-size: 0.75rem; font-weight: 500; color: #6b7280; margin-bottom: 0.375rem; }
      `}</style>
    </div>
  );
}
