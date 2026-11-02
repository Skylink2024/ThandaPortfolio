'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Soft 600px light that follows the cursor inside its (relatively positioned) parent.
 * Desktop / fine pointer only. Transform-only updates, rAF throttled.
 */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host || reduced) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let raf = 0;
    let x = 0;
    let y = 0;

    function apply() {
      raf = 0;
      if (!el) return;
      el.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;
      el.style.opacity = '1';
    }

    function onMove(e: PointerEvent) {
      if (!host) return;
      const rect = host.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
      if (!raf) raf = requestAnimationFrame(apply);
    }

    function onLeave() {
      if (el) el.style.opacity = '0';
    }

    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    return () => {
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 hidden size-[600px] rounded-full opacity-0 transition-opacity duration-500 pointer-fine:block"
      style={{
        background:
          'radial-gradient(circle, color-mix(in srgb, var(--cyan-glow) 28%, transparent) 0%, transparent 65%)',
        willChange: 'transform',
      }}
    />
  );
}
