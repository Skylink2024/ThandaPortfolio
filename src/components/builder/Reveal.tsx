'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { duration, ease } from '@/lib/motion';

export function BuilderReveal({
  stepKey,
  children,
}: {
  stepKey: string | number;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div key={stepKey}>{children}</div>;
  return (
    <motion.div
      key={stepKey}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: duration.base, ease: ease.out }}
    >
      {children}
    </motion.div>
  );
}
