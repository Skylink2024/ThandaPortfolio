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
            <Link href="/build" className="text-blue mt-2 inline-block font-semibold">
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
          className="buddy-bob size-14 drop-shadow-[0_10px_18px_rgba(11,31,58,0.25)] md:size-16"
        >
          <defs>
            <linearGradient id="brike-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#3d85ff" />
              <stop offset="1" stopColor="#13305a" />
            </linearGradient>
          </defs>
          <rect x="6" y="12" width="52" height="40" rx="12" fill="url(#brike-body)" />
          <path d="M6 30h52M24 12v18M40 30v22" stroke="#ffffff" strokeOpacity=".14" strokeWidth="2" />
          <rect x="10" y="15" width="22" height="6" rx="3" fill="#ffffff" opacity=".18" />
          <g className="buddy-blink">
            <circle cx="24" cy="32" r="6" fill="#fff" />
            <circle cx="42" cy="32" r="6" fill="#fff" />
            <circle cx={24 + eye.x} cy={32 + eye.y} r="2.8" fill="#061325" />
            <circle cx={42 + eye.x} cy={32 + eye.y} r="2.8" fill="#061325" />
          </g>
          <circle cx="17" cy="41" r="3" fill="#ff9e8a" opacity=".55" />
          <circle cx="49" cy="41" r="3" fill="#ff9e8a" opacity=".55" />
          <path d="M28 42q5 4 10 0" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </svg>
      </motion.button>
    </div>
  );
}
