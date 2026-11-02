'use client';

import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';
import { packages, type PackageId } from '@data/pricing';
import { PackageCard } from './PackageCard';

/** Window event the Configurator listens to so "Choose {name}" sets its package. */
export const SELECT_PACKAGE_EVENT = 'brike:select-package';

export function PackageGrid() {
  const [selected, setSelected] = useState<PackageId | null>(null);
  const reduced = useReducedMotion();

  function choose(id: PackageId) {
    setSelected(id);
    window.dispatchEvent(new CustomEvent<PackageId>(SELECT_PACKAGE_EVENT, { detail: id }));
    document
      .getElementById('configurator')
      ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }

  return (
    <ul
      id="packages"
      aria-label="Website packages"
      className="grid scroll-mt-24 grid-cols-1 gap-x-5 gap-y-8 pt-4 sm:grid-cols-2 lg:grid-cols-6"
    >
      {packages.map((pkg, i) => (
        <Reveal
          as="li"
          key={pkg.id}
          delay={(i % 3) * 0.06}
          className={cn(
            'lg:col-span-2',
            i === 3 && 'lg:col-start-2',
          )}
        >
          <PackageCard pkg={pkg} variant="full" selected={selected === pkg.id} onSelect={choose} />
        </Reveal>
      ))}
    </ul>
  );
}
