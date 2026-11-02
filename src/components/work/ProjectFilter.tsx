'use client';

import { cn } from '@/lib/cn';
import { industries } from '@data/builder';
import type { Industry } from '@data/projects';

export function ProjectFilter({
  available,
  active,
  onChange,
}: {
  available: Industry[];
  active: Industry | 'all';
  onChange: (i: Industry | 'all') => void;
}) {
  const options: { id: Industry | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    ...available.map((id) => ({
      id,
      label: industries.find((i) => i.id === id)?.label ?? id,
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by industry">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          role="tab"
          aria-selected={active === opt.id}
          onClick={() => onChange(opt.id)}
          className={cn(
            'h-10 rounded-full border px-4 text-sm transition-colors',
            active === opt.id
              ? 'border-gray-900 bg-gray-900 text-bg'
              : 'border-border text-gray-700 hover:border-gray-900',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
