'use client';

import { useCallback, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { MoveHorizontal } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface BeforeAfterSliderProps {
  before: React.ReactNode;
  after: React.ReactNode;
  initial?: number;
  labelBefore?: string;
  labelAfter?: string;
  className?: string;
}

const clamp = (n: number) => Math.min(100, Math.max(0, n));

/**
 * Comparison slider. The "after" layer sits on top and is revealed with
 * `clip-path: inset()`, so no layout/width is animated.
 */
export function BeforeAfterSlider({
  before,
  after,
  initial = 50,
  labelBefore = 'Before',
  labelAfter = 'After',
  className,
}: BeforeAfterSliderProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(clamp(initial));
  const [dragging, setDragging] = useState(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    setPos(clamp(((clientX - rect.left) / rect.width) * 100));
  }, []);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setFromClientX(e.clientX);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    setFromClientX(e.clientX);
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    let next: number | null = null;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = pos - 5;
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = pos + 5;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = 100;
    if (next === null) return;
    e.preventDefault();
    setPos(clamp(next));
  }

  const smooth = !dragging && !reduced;
  const rounded = Math.round(pos);

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={cn(
        'border-border relative aspect-[4/3] w-full cursor-ew-resize touch-pan-y overflow-hidden rounded-[var(--radius-lg)] border shadow-[var(--shadow-lg)] select-none sm:aspect-[16/10]',
        className,
      )}
    >
      <div className="absolute inset-0">{before}</div>
      <div
        className={cn('absolute inset-0', smooth && 'transition-[clip-path] duration-150')}
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
      >
        {after}
      </div>

      <span className="text-micro pointer-events-none absolute top-3 left-3 rounded-[var(--radius-sm)] bg-black/70 px-2.5 py-1 text-white">
        {labelBefore}
      </span>
      <span className="bg-blue text-micro pointer-events-none absolute top-3 right-3 rounded-[var(--radius-sm)] px-2.5 py-1 text-white">
        {labelAfter}
      </span>

      <div
        className={cn(
          'absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.25)]',
          smooth && 'transition-[left] duration-150',
        )}
        style={{ left: `${pos}%` }}
      >
        <div
          role="slider"
          tabIndex={0}
          aria-label="Before and after comparison"
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={rounded}
          aria-valuetext={`${rounded}% before, ${100 - rounded}% after`}
          onKeyDown={onKeyDown}
          className="text-navy focus-visible:outline-blue absolute top-1/2 left-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[var(--shadow-md)] focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <MoveHorizontal className="size-5" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
