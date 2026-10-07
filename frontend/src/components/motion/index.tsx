'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fadeUp, fadeIn, scaleIn, staggerContainer, staggerItem, fadeLeft, fadeRight } from '@/lib/motion';
import { ReactNode } from 'react';

interface MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

// ---- FadeIn ----
export function FadeIn({ children, className, delay = 0 }: MotionProps) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      variants={prefersReduced ? {} : fadeIn}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---- FadeUp ----
export function FadeUp({ children, className, delay = 0 }: MotionProps) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      variants={prefersReduced ? {} : fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---- ScrollReveal (animates when scrolled into view) ----
interface ScrollRevealProps extends MotionProps {
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  amount?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  amount = 0.2,
}: ScrollRevealProps) {
  const prefersReduced = useReducedMotion();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: amount });

  const variantMap = {
    up: fadeUp,
    down: { hidden: { opacity: 0, y: -24 }, visible: { opacity: 1, y: 0 } },
    left: fadeLeft,
    right: fadeRight,
    scale: scaleIn,
  };

  const variants = variantMap[direction] || fadeUp;

  return (
    <motion.div
      ref={ref}
      variants={prefersReduced ? {} : variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---- Stagger container ----
interface StaggerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function Stagger({ children, className, delay = 0 }: StaggerProps) {
  const prefersReduced = useReducedMotion();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      variants={prefersReduced ? {} : staggerContainer}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delayChildren: delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---- Stagger Item ----
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div variants={prefersReduced ? {} : staggerItem} className={className}>
      {children}
    </motion.div>
  );
}

// ---- AnimatedCounter ----
import CountUp from 'react-countup';

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
  duration = 2,
  className,
}: AnimatedCounterProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <span ref={ref} className={className}>
      {inView ? (
        <CountUp start={0} end={end} duration={duration} prefix={prefix} suffix={suffix} separator="," />
      ) : (
        `${prefix}0${suffix}`
      )}
    </span>
  );
}

// ---- Float (infinite floating animation) ----
export function Float({ children, className }: { children: ReactNode; className?: string }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      animate={prefersReduced ? {} : { y: [0, -12, 0] }}
      transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---- PageTransition ----
export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={prefersReduced ? {} : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
