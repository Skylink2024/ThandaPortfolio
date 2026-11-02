'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { fadeUp, reducedMotionVariants } from '@/lib/motion';

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li';
  delay?: number;
}

export function Reveal({ children, className, as = 'div', delay = 0 }: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={reduced ? reducedMotionVariants : fadeUp}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Component>
  );
}
