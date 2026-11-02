'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { DeviceFrame } from '@/components/ui/DeviceFrame';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';
import { MiniSite } from './MiniSite';
import { exampleDesigns } from './exampleDesigns';

const CYCLE_MS = 4000;
const MAX_TILT = 6;

/**
 * Cycles 4 fictional example designs inside a tilted desktop frame with a
 * phone frame overlapping bottom-left.
 * TODO(Phase 5): render the real builder preview components here.
 */
export function HeroMockupCycler() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const tiltRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const design = exampleDesigns[index] ?? exampleDesigns[0]!;

  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % exampleDesigns.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [reduced, paused]);

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = tiltRef.current;
      if (!el || reduced) return;
      if (!window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        el.style.setProperty('--rx', `${8 - py * 2 * MAX_TILT}deg`);
        el.style.setProperty('--ry', `${-14 + px * 2 * MAX_TILT}deg`);
      });
    },
    [reduced],
  );

  const onLeave = useCallback(() => {
    cancelAnimationFrame(raf.current);
    tiltRef.current?.style.removeProperty('--rx');
    tiltRef.current?.style.removeProperty('--ry');
    setPaused(false);
  }, []);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const swap = reduced
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        initial: { opacity: 0, scale: 1.04 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.98 },
      };

  return (
    <div
      className="relative mx-auto w-[90%] pb-8 lg:w-full lg:pb-0"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerEnter={() => setPaused(true)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className={cn(!reduced && 'brike-float')}>
        <div
          ref={tiltRef}
          className="relative [transform:perspective(1600px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] transition-transform duration-300 ease-out lg:[--rx:8deg] lg:[--ry:-14deg]"
        >
          <DeviceFrame device="desktop" url="yourbusiness.co.za">
            <div className="relative h-full w-full">
              <AnimatePresence initial={false}>
                <motion.div
                  key={design.id}
                  className="absolute inset-0"
                  {...swap}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <MiniSite design={design} />
                </motion.div>
              </AnimatePresence>
            </div>
          </DeviceFrame>

          <DeviceFrame
            device="phone"
            className="absolute -bottom-2 -left-3 mx-0 w-[24%] max-w-none sm:-left-6 lg:-bottom-8 lg:-left-10"
          >
            <div className="relative h-full w-full">
              <AnimatePresence initial={false}>
                <motion.div
                  key={design.id}
                  className="absolute inset-0"
                  {...swap}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <MiniSite design={design} mobile />
                </motion.div>
              </AnimatePresence>
            </div>
          </DeviceFrame>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3 lg:mt-10">
        <Badge tone="blue">Example design</Badge>
        <span className="text-small text-gray-500" aria-live="polite">
          {design.name}
        </span>
        <div className="flex gap-1.5" role="group" aria-label="Choose an example design">
          {exampleDesigns.map((d, i) => (
            <button
              key={d.id}
              type="button"
              aria-label={`Show ${d.name}`}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
              className="flex size-6 items-center justify-center"
            >
              <span
                className={cn(
                  'block size-2 rounded-full transition-colors',
                  i === index ? 'bg-blue' : 'bg-gray-300',
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
