'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Price } from '@/components/ui/Price';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/cn';
import { packages, type Package } from '@data/pricing';

function CompactPackageCard({ pkg }: { pkg: Package }) {
  return (
    <Card
      interactive
      className={cn(
        'relative flex h-full flex-col p-5',
        pkg.popular && 'border-blue shadow-[var(--shadow-glow)]',
      )}
    >
      {pkg.popular ? (
        <Badge tone="blue" className="bg-blue absolute -top-3 left-5 text-white">
          Most popular
        </Badge>
      ) : null}
      <h3 className="text-h3 text-gray-900">{pkg.name}</h3>
      <div className="mt-3">
        <Price amount={pkg.price} size="md" />
      </div>
      <ul className="mt-5 flex-1 space-y-2.5">
        {pkg.included.slice(0, 3).map((item) => (
          <li key={item} className="text-small flex gap-2 font-normal text-gray-700">
            <Check className="text-success mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <Button
        href={`/build?package=${pkg.id}`}
        variant={pkg.popular ? 'primary' : 'outline'}
        size="sm"
        fullWidth
        className="mt-6 h-auto min-h-10 py-2.5 text-center"
      >
        {`Choose ${pkg.name}`}
      </Button>
    </Card>
  );
}

export function PackagesPreview() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    if (!first) return;
    const step = first.offsetWidth + 16;
    setActive(Math.min(packages.length - 1, Math.max(0, Math.round(el.scrollLeft / step))));
  }, []);

  const goTo = useCallback((i: number) => {
    const el = trackRef.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (!el || !child) return;
    el.scrollTo({ left: child.offsetLeft - el.offsetLeft - 20, behavior: 'smooth' });
  }, []);

  return (
    <Section id="packages" tone="surface">
      <SectionHeading
        align="center"
        title="Simple prices. No surprises."
        subtitle="Once-off prices in Rand. Pay only after you approve your site."
      />

      <Reveal>
        <ul
          ref={trackRef}
          onScroll={onScroll}
          aria-label="Website packages"
          className="-mx-5 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto px-5 pt-4 pb-6 md:mx-0 md:grid md:snap-none md:grid-cols-6 md:overflow-visible md:px-0 lg:grid-cols-5 [&::-webkit-scrollbar]:hidden"
        >
          {packages.map((pkg, i) => (
            <li
              key={pkg.id}
              className={cn(
                'w-[80%] shrink-0 snap-center sm:w-[60%] md:w-auto md:shrink',
                // md: 3 + 2 (centered); lg: 5 columns
                'md:col-span-2 lg:col-span-1',
                i === 3 && 'md:col-start-2 lg:col-start-auto',
              )}
            >
              <CompactPackageCard pkg={pkg} />
            </li>
          ))}
        </ul>

        <div
          className="mt-2 flex justify-center gap-1 md:hidden"
          role="group"
          aria-label="Package carousel"
        >
          {packages.map((pkg, i) => (
            <button
              key={pkg.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${pkg.name}`}
              aria-current={i === active}
              className="flex size-6 items-center justify-center"
            >
              <span
                className={cn(
                  'block size-2 rounded-full transition-all',
                  i === active ? 'bg-blue w-5' : 'bg-gray-300',
                )}
              />
            </button>
          ))}
        </div>
      </Reveal>

      <p className="mt-8 text-center">
        <Link
          href="/pricing"
          className="text-blue font-semibold underline-offset-4 hover:underline"
        >
          See full pricing and extras →
        </Link>
      </p>
    </Section>
  );
}
