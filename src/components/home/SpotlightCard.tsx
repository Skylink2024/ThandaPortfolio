'use client';

import { useRef } from 'react';
import { cn } from '@/lib/cn';

export interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

/** Card with a soft light that follows the cursor inside it (desktop hover only). */
export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={cn(
        'group border-border bg-bg relative overflow-hidden rounded-[var(--radius-lg)] border p-6 shadow-[var(--shadow-sm)] transition-shadow duration-300 hover:shadow-[var(--shadow-lg)]',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--blue) 16%, transparent), transparent 70%)',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
