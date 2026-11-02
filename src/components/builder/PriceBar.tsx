'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { formatZAR } from '@/lib/format';
import type { Quote } from '@/lib/pricing';
import { cn } from '@/lib/cn';
import { Badge } from '@/components/ui/Badge';

export function PriceBar({ quote, className }: { quote: Quote; className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        'border-border bg-bg/95 rounded-[var(--radius-lg)] border p-4 shadow-[var(--shadow-md)] backdrop-blur',
        className,
      )}
    >
      <button
        type="button"
        className="flex w-full items-start justify-between gap-3 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div>
          <p className="text-micro text-gray-500">Your website so far</p>
          {quote.overCap ? (
            <p className="mt-1 font-semibold text-gray-900">
              Let&apos;s chat, I&apos;ll give you a custom quote.
            </p>
          ) : (
            <p className="mt-1 font-mono text-lg font-bold text-gray-900">
              {formatZAR(quote.onceOff)}{' '}
              <span className="text-sm font-semibold text-gray-500">once-off</span>
              {quote.monthly > 0 ? (
                <>
                  {' '}
                  + {formatZAR(quote.monthly)}
                  <span className="text-sm font-semibold text-gray-500">/month</span>
                </>
              ) : null}
            </p>
          )}
          <div className="mt-2">
            <Badge tone="blue">{quote.package.name}</Badge>
          </div>
        </div>
        <ChevronDown
          className={cn('size-5 shrink-0 text-gray-500 transition', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      {open ? (
        <ul className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
          {quote.lines.map((line) => (
            <li key={line.id} className="flex justify-between gap-3 text-gray-700">
              <span>
                {line.label}
                {line.note ? (
                  <span className="mt-0.5 block text-xs text-gray-500">{line.note}</span>
                ) : null}
              </span>
              <span className="font-mono shrink-0">
                {line.billing === 'hour'
                  ? `${formatZAR(line.amount)}/hr`
                  : line.note?.startsWith('Included')
                    ? '—'
                    : formatZAR(line.amount)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
