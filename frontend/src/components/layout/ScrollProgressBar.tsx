'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';

/**
 * ScrollProgressBar
 * A thin bar at the top of the page that fills as the user scrolls.
 * Uses Framer Motion's useScroll + useSpring for smooth physics.
 * Respects prefers-reduced-motion.
 */
export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const prefersReduced = useReducedMotion();

  // Smooth spring — use zero stiffness/damping when reduced motion
  const scaleX = useSpring(scrollYProgress, {
    stiffness: prefersReduced ? 0 : 200,
    damping: prefersReduced ? 0 : 30,
    restDelta: 0.001,
  });

  if (prefersReduced) return null;

  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0%' }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-500 z-[200] origin-left"
      aria-hidden="true"
    />
  );
}
