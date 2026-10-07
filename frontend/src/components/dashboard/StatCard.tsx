'use client';

import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color?: 'teal' | 'blue' | 'green' | 'orange' | 'red' | 'purple';
  suffix?: string;
  prefix?: string;
  subtitle?: string;
  animate?: boolean;
}

const colorMap = {
  teal:   { bg: 'bg-primary-50',   icon: 'bg-primary-100   text-primary-600',  text: 'text-primary-700' },
  blue:   { bg: 'bg-blue-50',      icon: 'bg-blue-100      text-blue-600',      text: 'text-blue-700' },
  green:  { bg: 'bg-green-50',     icon: 'bg-green-100     text-green-600',     text: 'text-green-700' },
  orange: { bg: 'bg-orange-50',    icon: 'bg-orange-100    text-orange-600',    text: 'text-orange-700' },
  red:    { bg: 'bg-red-50',       icon: 'bg-red-100       text-red-600',       text: 'text-red-700' },
  purple: { bg: 'bg-purple-50',    icon: 'bg-purple-100    text-purple-600',    text: 'text-purple-700' },
};

export default function StatCard({ title, value, icon: Icon, color = 'teal', suffix = '', prefix = '', subtitle, animate = true }: StatCardProps) {
  const colors = colorMap[color];
  const isNumber = typeof value === 'number';

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={cn('rounded-2xl p-6 shadow-card', colors.bg)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', colors.icon)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className={cn('font-heading font-extrabold text-3xl mb-1', colors.text)}>
        {isNumber && animate ? (
          <AnimatedCounter end={value as number} suffix={suffix} prefix={prefix} />
        ) : (
          `${prefix}${value}${suffix}`
        )}
      </div>
      <p className="text-gray-600 font-medium text-sm">{title}</p>
      {subtitle && <p className="text-gray-400 text-xs mt-0.5">{subtitle}</p>}
    </motion.div>
  );
}
