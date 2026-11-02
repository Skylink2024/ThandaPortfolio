'use client';

import { cn } from '@/lib/cn';

export interface ToggleProps {
  checked: boolean;
  onChange(v: boolean): void;
  label: string;
  description?: string;
  priceLabel?: string;
  /** Small chip next to the label, e.g. "Included". */
  badge?: string;
  disabled?: boolean;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  priceLabel,
  badge,
  disabled = false,
}: ToggleProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start justify-between gap-4 rounded-[var(--radius-md)] border border-border bg-bg p-4',
        disabled && 'cursor-not-allowed',
        disabled && !badge && 'opacity-50',
      )}
    >
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2 font-semibold text-gray-900">
          {label}
          {badge ? (
            <span className="bg-success/15 text-success text-micro rounded-[var(--radius-sm)] px-2 py-0.5 font-semibold">
              {badge}
            </span>
          ) : null}
        </span>
        {description ? <span className="mt-1 block text-small text-gray-500">{description}</span> : null}
        {priceLabel ? <span className="mt-2 block text-small font-medium text-blue">{priceLabel}</span> : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition-colors',
          checked ? 'bg-blue' : 'bg-gray-300',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow transition-transform',
            checked && 'translate-x-5',
          )}
        />
      </button>
    </label>
  );
}
