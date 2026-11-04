'use client';

import { useEffect, useState } from 'react';
import { useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { formatZAR } from '@/lib/format';
import { cn } from '@/lib/cn';

export interface PriceProps {
  amount: number;
  period?: 'once' | 'month' | 'year' | 'hour';
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses: Record<NonNullable<PriceProps['size']>, string> = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl md:text-5xl',
};

const periodLabel: Record<NonNullable<PriceProps['period']>, string> = {
  once: 'once-off',
  month: '/month',
  year: '/year',
  hour: '/hour',
};

export function Price({
  amount,
  period = 'once',
  animate = false,
  size = 'md',
  className,
}: PriceProps) {
  const reduced = useReducedMotion();
  const shouldAnimate = animate && !reduced;
  const motionValue = useMotionValue(amount);
  const spring = useSpring(motionValue, {
    stiffness: 120,
    damping: 24,
    mass: 0.6,
  });
  const [display, setDisplay] = useState(amount);
  const [live, setLive] = useState(formatZAR(amount));

  useEffect(() => {
    if (!shouldAnimate) return;
    motionValue.set(amount);
  }, [amount, shouldAnimate, motionValue]);

  useEffect(() => {
    if (!shouldAnimate) return;
    const unsub = spring.on('change', (v) => {
      setDisplay(Math.round(v));
    });
    return () => unsub();
  }, [spring, shouldAnimate]);

  useEffect(() => {
    if (!shouldAnimate) return;
    const t = window.setTimeout(() => {
      setLive(formatZAR(amount));
    }, 500);
    return () => window.clearTimeout(t);
  }, [amount, shouldAnimate]);

  const shown = shouldAnimate ? display : amount;
  const announced = shouldAnimate ? live : formatZAR(amount);

  return (
    <span
      className={cn(
        'inline-flex items-baseline gap-2 font-heading font-bold text-gray-900',
        sizeClasses[size],
        className,
      )}
    >
      <span aria-hidden="true" className="font-mono tracking-tight text-orange-ink">
        {formatZAR(shown)}
      </span>
      <span className="text-small font-medium text-gray-500">{periodLabel[period]}</span>
      <span className="sr-only" aria-live="polite">
        {announced}
        {period !== 'once' ? ` ${periodLabel[period]}` : ` ${periodLabel.once}`}
      </span>
    </span>
  );
}
