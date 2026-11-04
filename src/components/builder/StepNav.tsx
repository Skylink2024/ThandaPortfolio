'use client';

import { cn } from '@/lib/cn';
import type { BuilderStep } from '@/store/builder';

export const STEP_LABELS = [
  'Business',
  'Style',
  'Pages',
  'Features',
  'Extras',
  'Quote',
] as const;

export function StepNav({
  step,
  onJump,
}: {
  step: BuilderStep;
  onJump: (s: BuilderStep) => void;
}) {
  const progress = ((step + 1) / STEP_LABELS.length) * 100;

  return (
    <div>
      <div className="bg-surface-2 h-1.5 overflow-hidden rounded-full">
        <div
          className="bg-navy h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <ol className="mt-4 flex flex-wrap gap-2">
        {STEP_LABELS.map((label, i) => {
          const done = i < step;
          const current = i === step;
          const clickable = i <= step;
          return (
            <li key={label}>
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onJump(i as BuilderStep)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                  current && 'border-navy bg-navy text-white',
                  done && !current && 'border-navy/40 text-navy',
                  !done && !current && 'border-border text-gray-500',
                  !clickable && 'opacity-50',
                )}
              >
                <span
                  className={cn(
                    'flex size-5 items-center justify-center rounded-full text-[10px]',
                    current ? 'bg-white/20' : 'bg-black/5',
                  )}
                >
                  {i + 1}
                </span>
                {label}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
