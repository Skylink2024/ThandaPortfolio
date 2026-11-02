'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export interface SmoothScrollProps {
  children: React.ReactNode;
}

/** Lenis smooth scrolling — disabled when reduced motion is preferred. */
export function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | null = null;
    let frame = 0;

    function start() {
      stop();
      if (media.matches) return;

      lenis = new Lenis({
        duration: 1.1,
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis?.raf(time);
        frame = requestAnimationFrame(raf);
      }
      frame = requestAnimationFrame(raf);
    }

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      lenis?.destroy();
      lenis = null;
    }

    start();
    media.addEventListener('change', start);

    return () => {
      media.removeEventListener('change', start);
      stop();
    };
  }, []);

  return <>{children}</>;
}
