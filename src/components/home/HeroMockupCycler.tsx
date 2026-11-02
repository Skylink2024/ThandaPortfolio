'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Smartphone } from 'lucide-react';
import { DeviceFrame } from '@/components/ui/DeviceFrame';
import { cn } from '@/lib/cn';
import { MiniSite } from './MiniSite';
import { exampleDesigns } from './exampleDesigns';

const CYCLE_MS = 4500;

/** Glass showcase of example designs, cross-fading on a timer; sits on the dark hero. */
export function HeroMockupCycler() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const design = exampleDesigns[index] ?? exampleDesigns[0]!;

  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % exampleDesigns.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [reduced, paused]);

  const swap = reduced
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };

  return (
    <div
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="glass-dark relative overflow-hidden rounded-[var(--radius-xl)] p-3 sm:p-5">
        <DeviceFrame
          device="desktop"
          url="yourbusiness.co.za"
          className="shadow-[0_30px_80px_-20px_rgba(3,10,25,0.7)]"
        >
          <div className="relative h-full w-full">
            <AnimatePresence initial={false}>
              <motion.div
                key={design.id}
                className="absolute inset-0"
                {...swap}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <MiniSite design={design} />
              </motion.div>
            </AnimatePresence>
          </div>
        </DeviceFrame>

        <DeviceFrame
          device="phone"
          className="absolute right-3 bottom-3 mx-0 hidden w-[22%] max-w-[140px] shadow-[0_30px_60px_-15px_rgba(3,10,25,0.8)] sm:block md:right-6 md:bottom-5"
        >
          <div className="relative h-full w-full">
            <AnimatePresence initial={false}>
              <motion.div
                key={design.id}
                className="absolute inset-0"
                {...swap}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <MiniSite design={design} mobile />
              </motion.div>
            </AnimatePresence>
          </div>
        </DeviceFrame>

        <div className="animate-float glass-dark text-small absolute top-4 left-4 hidden items-center gap-2 rounded-full px-3 py-1.5 text-white md:inline-flex">
          <CheckCircle2 className="size-4 text-emerald-400" aria-hidden="true" />
          Approved. Now you pay.
        </div>
        <div
          className="animate-float glass-dark text-small absolute bottom-5 left-5 hidden items-center gap-2 rounded-full px-3 py-1.5 text-white lg:inline-flex"
          style={{ animationDelay: '-3s' }}
        >
          <Smartphone className="size-4 text-sky-300" aria-hidden="true" />
          Looks great on phones
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <p className="text-small text-white/70" aria-live="polite">
          <span className="text-white">{design.name}</span> · Example design
        </p>
        <div className="flex gap-1" role="group" aria-label="Choose an example design">
          {exampleDesigns.map((d, i) => (
            <button
              key={d.id}
              type="button"
              aria-label={`Show ${d.name}`}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
              className="flex h-8 items-center px-1"
            >
              <span
                className={cn(
                  'block h-0.5 rounded-full transition-all duration-300',
                  i === index ? 'w-8 bg-white' : 'w-4 bg-white/30',
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
