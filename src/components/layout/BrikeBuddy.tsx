'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import {
  clampDrag,
  dockInsets,
  dockToWall,
  nearerSide,
  type DockSide,
  type Viewport,
} from '@/lib/buddy-dock';

const lines = [
  'Hi! Want to see your website before you pay?',
  'Psst… it takes 2 minutes to design yours.',
  'No deposit. You pay when you love it.',
];

const DOCK_EASE = 'transform 480ms cubic-bezier(0.16, 1, 0.3, 1)';

interface Place {
  x: number;
  y: number;
  side: DockSide;
}

interface Drag {
  pointerId: number;
  dx: number;
  dy: number;
  startX: number;
  startY: number;
  moved: boolean;
  width: number;
  height: number;
}

function readViewport(): Viewport & { mobile: boolean } {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    mobile: window.matchMedia('(max-width: 767px)').matches,
  };
}

function bubbleAlign(y: number, height: number, viewportHeight: number) {
  if (viewportHeight <= 0) return 'center' as const;
  if (y < 120) return 'top' as const;
  if (y + height > viewportHeight - 200) return 'bottom' as const;
  return 'center' as const;
}

/** Brick mascot. Drag it anywhere; on release it docks to the nearer side wall. */
export function BrikeBuddy() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dragRef = useRef<Drag | null>(null);
  const suppressClick = useRef(false);
  const [eye, setEye] = useState({ x: 0, y: 0 });
  const [open, setOpen] = useState(false);
  const [line, setLine] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState<Place | null>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (reduced) return;
    function onMove(e: PointerEvent) {
      if (dragRef.current) return;
      const box = svgRef.current?.getBoundingClientRect();
      if (!box) return;
      const dx = e.clientX - (box.left + box.width / 2);
      const dy = e.clientY - (box.top + box.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      setEye({ x: (dx / d) * 2.2, y: (dy / d) * 2.2 });
    }
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced]);

  useLayoutEffect(() => {
    const node = buttonRef.current;
    if (!node || dragRef.current) return;
    const rect = node.getBoundingClientRect();
    const vp = readViewport();
    setViewport(vp);
    setPos((prev) => {
      const side = prev?.side ?? (vp.mobile ? 'left' : 'right');
      return dockToWall(
        {
          x: prev?.x ?? rect.left,
          y: prev?.y ?? rect.top,
          width: rect.width,
          height: rect.height,
        },
        vp,
        dockInsets(vp.mobile, side),
        side,
      );
    });
  }, [pathname]);

  useEffect(() => {
    function onResize() {
      const node = buttonRef.current;
      if (!node || dragRef.current) return;
      const rect = node.getBoundingClientRect();
      const vp = readViewport();
      setViewport(vp);
      setPos((prev) => {
        if (!prev) return prev;
        return dockToWall(
          { x: prev.x, y: prev.y, width: rect.width, height: rect.height },
          vp,
          dockInsets(vp.mobile, prev.side),
          prev.side,
        );
      });
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    if (e.button !== 0 || dragRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current = {
      pointerId: e.pointerId,
      dx: e.clientX - rect.left,
      dy: e.clientY - rect.top,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
      width: rect.width,
      height: rect.height,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setPos(
      (prev) =>
        prev ?? {
          x: rect.left,
          y: rect.top,
          side: nearerSide(rect.left + rect.width / 2, window.innerWidth),
        },
    );
  }

  function onPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    if (Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 8) drag.moved = true;
    const next = clampDrag(e.clientX - drag.dx, e.clientY - drag.dy, drag, {
      width: window.innerWidth,
      height: window.innerHeight,
    });
    setPos((prev) => ({ x: next.x, y: next.y, side: prev?.side ?? 'right' }));
  }

  function finishDrag(e: React.PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    dragRef.current = null;
    if (!drag.moved) {
      setDragging(false);
      return;
    }
    suppressClick.current = true;
    const released = clampDrag(e.clientX - drag.dx, e.clientY - drag.dy, drag, {
      width: window.innerWidth,
      height: window.innerHeight,
    });
    const box = { ...released, width: drag.width, height: drag.height };
    setPos((prev) => ({ x: released.x, y: released.y, side: prev?.side ?? 'right' }));
    requestAnimationFrame(() => {
      const vp = readViewport();
      setViewport(vp);
      setDragging(false);
      setPos(
        dockToWall(box, vp, dockInsets(vp.mobile, nearerSide(box.x + box.width / 2, vp.width))),
      );
    });
  }

  if (hidden || pathname.startsWith('/build') || pathname.startsWith('/admin')) return null;

  const side = pos?.side ?? 'right';
  const align = bubbleAlign(pos?.y ?? 0, 64, viewport.height);

  return (
    <div
      data-webbie
      data-dock={pos ? side : undefined}
      className={cn('fixed z-30', !pos && 'top-1/2 -translate-y-1/2', !pos && 'right-0')}
      style={
        pos
          ? {
              left: 0,
              top: 0,
              transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
              transition: dragging || reduced ? 'none' : DOCK_EASE,
            }
          : undefined
      }
    >
      <AnimatePresence>
        {open ? (
          <motion.div
            id="brike-buddy-note"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'glass absolute w-52 rounded-[var(--radius-lg)] p-3 text-sm text-gray-900 shadow-[var(--shadow-md)]',
              side === 'left' ? 'left-[calc(100%+8px)]' : 'right-[calc(100%+8px)]',
              align === 'top' && 'top-0',
              align === 'bottom' && 'bottom-0',
              align === 'center' && 'top-1/2 -translate-y-1/2',
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

      <button
        ref={buttonRef}
        type="button"
        aria-label="Say hi to Brike"
        aria-expanded={open}
        aria-controls={open ? 'brike-buddy-note' : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onLostPointerCapture={finishDrag}
        onDragStart={(e) => e.preventDefault()}
        onClick={() => {
          if (suppressClick.current) {
            suppressClick.current = false;
            return;
          }
          setOpen((v) => !v);
          setLine((l) => (open ? l : (l + 1) % lines.length));
        }}
        className={cn('block cursor-grab touch-none select-none', dragging && 'cursor-grabbing')}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 64 64"
          className="buddy-bob size-14 drop-shadow-[0_10px_18px_rgba(10,26,54,0.25)] md:size-16"
          style={dragging ? { animation: 'none' } : undefined}
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
          <path
            d="M28 42q5 4 10 0"
            stroke="#fff"
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
