'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Button, type ButtonProps } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { spring as springs } from '@/lib/motion';

export interface MagneticButtonProps extends ButtonProps {
  strength?: number;
}

export function MagneticButton({
  strength = 0.3,
  className,
  children,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springs.snappy);
  const springY = useSpring(y, springs.snappy);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn('inline-flex', className)}
    >
      <Button {...rest}>{children}</Button>
    </motion.div>
  );
}
