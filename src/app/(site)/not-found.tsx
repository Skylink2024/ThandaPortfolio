'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Link2Off } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { spring } from '@/lib/motion';

export default function NotFound() {
  const reduced = useReducedMotion();

  return (
    <div className="container-brike flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <motion.div
        className="mb-10 w-full max-w-xs"
        initial={reduced ? false : { y: -120, rotate: -8, opacity: 0 }}
        animate={{ y: 0, rotate: 0, opacity: 1 }}
        transition={reduced ? { duration: 0 } : spring.soft}
      >
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-lg)]">
          <div className="flex items-center gap-1.5 border-b border-border bg-surface-2 px-3 py-2">
            <span className="size-2.5 rounded-full bg-danger/80" />
            <span className="size-2.5 rounded-full bg-warning/80" />
            <span className="size-2.5 rounded-full bg-success/80" />
            <span className="ml-2 flex-1 truncate rounded-full bg-border/70 px-2 py-0.5 text-left text-[10px] text-gray-500">
              brikeweb.co.za/missing
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-10">
            <Link2Off className="size-10 text-blue" aria-hidden="true" />
            <p className="text-small text-gray-500">404 · link snapped</p>
          </div>
        </div>
      </motion.div>

      <h1 className="text-h1">This page went to lunch.</h1>
      <p className="mt-4 max-w-md text-lead text-gray-500">
        But your future website is right here.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href="/">Back home</Button>
        <Button href="/build" variant="outline">
          Design my site
        </Button>
      </div>
    </div>
  );
}
