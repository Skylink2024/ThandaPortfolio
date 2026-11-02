'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export interface CounterProps {
  to: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
}

export function Counter({ to, prefix = '', suffix = '', durationMs = 1400 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness: 80,
    damping: 20,
    duration: durationMs / 1000,
  });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    motionValue.set(to);
  }, [inView, to, motionValue]);

  useEffect(() => {
    if (reduced) return;
    const unsub = spring.on('change', (v) => {
      setDisplay(Math.round(v));
    });
    return () => unsub();
  }, [spring, reduced]);

  const shown = reduced || !inView ? (inView ? to : 0) : display;

  return (
    <motion.span ref={ref} className="tabular-nums">
      {prefix}
      {shown}
      {suffix}
    </motion.span>
  );
}
