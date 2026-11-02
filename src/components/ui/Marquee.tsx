'use client';

import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface MarqueeProps {
  items: string[];
  speedSeconds?: number;
  direction?: 'left' | 'right';
  className?: string;
}

export function Marquee({
  items,
  speedSeconds = 30,
  direction = 'left',
  className,
}: MarqueeProps) {
  const reduced = useReducedMotion();
  const loop = [...items, ...items];

  return (
    <div className={cn('overflow-hidden', className)}>
      <div
        className={cn('flex w-max gap-8', !reduced && 'brike-marquee')}
        style={
          reduced
            ? undefined
            : {
                animationDuration: `${speedSeconds}s`,
                animationDirection: direction === 'left' ? 'normal' : 'reverse',
              }
        }
      >
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="whitespace-nowrap text-small font-semibold text-gray-500"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
