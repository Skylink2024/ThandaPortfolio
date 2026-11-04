'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

const lines = [
  'Hi! Want to see your website before you pay?',
  'Psst… it takes 2 minutes to design yours.',
  'No deposit. You pay when you love it.',
];

/** Small brick mascot peeking from the right edge. Eyes follow the pointer; tap to say hi. */
export function BrikeBuddy() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const ref = useRef<SVGSVGElement>(null);
  const [eye, setEye] = useState({ x: 0, y: 0 });
  const [open, setOpen] = useState(false);
  const [line, setLine] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reduced) return;
    function onMove(e: PointerEvent) {
      const box = ref.current?.getBoundingClientRect();
      if (!box) return;
      const dx = e.clientX - (box.left + box.width / 2);
      const dy = e.clientY - (box.top + box.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      setEye({ x: (dx / d) * 2.2, y: (dy / d) * 2.2 });
    }
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced]);

  if (hidden || pathname.startsWith('/build') || pathname.startsWith('/admin')) return null;

  return (
    <div
      className={cn(
        'fixed top-1/2 z-30 -translate-y-1/2',
        isMobile ? 'left-0' : 'right-0',
      )}
    >
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, x: isMobile ? -12 : 12, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: isMobile ? -12 : 12, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={cn(
              'glass absolute top-1/2 w-52 -translate-y-1/2 rounded-[var(--radius-lg)] p-3 text-sm text-gray-900 shadow-[var(--shadow-md)]',
              isMobile ? 'left-[calc(100%+4px)]' : 'right-[calc(100%+4px)]',
            )}
          >
            <button
              type="button"
              onClick={() => setHidden(true)}
              aria-label="Hide helper"
              className="absolute top-1.5 right-1.5 rounded-full p-1 text-gray-500 hover:text-gray-900"
            >
              <X className="size-3.5" />
            </button>
            <p className="pr-4">{lines[line]}</p>
            <Link href="/build" className="text-link mt-2 inline-block font-semibold">
              Design my site →
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label="Say hi to Brike"
        onClick={() => {
          setOpen((v) => !v);
          setLine((l) => (open ? l : (l + 1) % lines.length));
        }}
        initial={reduced ? false : { x: isMobile ? -40 : 40 }}
        animate={{ x: isMobile ? -10 : 10 }}
        whileHover={{ x: 0, rotate: isMobile ? 6 : -6 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="block"
      >
        <svg
          ref={ref}
          viewBox="0 0 64 64"
          className="buddy-bob size-14 drop-shadow-[0_10px_18px_rgba(10,26,54,0.25)] md:size-16"
        >
          <rect x="6" y="12" width="52" height="40" rx="14" fill="var(--blue)" />
          <rect x="12" y="16" width="18" height="5" rx="2.5" fill="#fff" opacity=".25" />
          <circle cx="50" cy="18" r="3.2" fill="var(--orange)" />
          <g className="buddy-blink">
            <circle cx="24" cy="32" r="6" fill="#fff" />
            <circle cx="42" cy="32" r="6" fill="#fff" />
            <circle cx={24 + eye.x} cy={32 + eye.y} r="2.8" fill="var(--navy)" />
            <circle cx={42 + eye.x} cy={32 + eye.y} r="2.8" fill="var(--navy)" />
          </g>
          <path d="M28 42q5 4 10 0" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </svg>
      </motion.button>
    </div>
  );
}
