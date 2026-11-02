'use client';

import { cn } from '@/lib/cn';

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SegmentedProps<T extends string = string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange(value: T): void;
  ariaLabel: string;
  className?: string;
}

export function Segmented<T extends string = string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        'flex flex-wrap rounded-[var(--radius-md)] border border-border bg-surface-2 p-1 sm:inline-flex sm:flex-nowrap',
        className,
      )}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={opt.disabled}
            onClick={() => onChange(opt.value)}
            className={cn(
              'min-w-0 flex-1 rounded-[calc(var(--radius-md)-2px)] px-2 py-2 text-xs font-semibold transition-colors sm:flex-none sm:px-3 sm:text-small',
              selected ? 'bg-bg text-gray-900 shadow-[var(--shadow-sm)]' : 'text-gray-700',
              opt.disabled && 'opacity-40',
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
