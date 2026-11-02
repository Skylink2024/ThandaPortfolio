'use client';

import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Price } from '@/components/ui/Price';
import { cn } from '@/lib/cn';
import type { Package, PackageId } from '@data/pricing';

export interface PackageCardProps {
  pkg: Package;
  variant: 'compact' | 'full';
  selected?: boolean;
  onSelect?(id: PackageId): void;
}

export function PackageCard({ pkg, variant, selected = false, onSelect }: PackageCardProps) {
  const full = variant === 'full';

  return (
    <Card
      interactive
      aria-label={`${pkg.name} package`}
      className={cn(
        'relative flex h-full flex-col',
        full ? 'p-6' : 'p-5',
        pkg.popular && 'border-gray-900',
        selected && 'ring-2 ring-gray-900',
      )}
    >
      {pkg.popular ? (
        <Badge tone="neutral" className="bg-gray-900 text-bg absolute -top-3 left-6">
          Most popular
        </Badge>
      ) : null}

      <h3 className="text-h3 text-gray-900">{pkg.name}</h3>
      {full ? <p className="mt-2 text-gray-700">{pkg.tagline}</p> : null}

      <div className="mt-4">
        <Price amount={pkg.price} size={full ? 'xl' : 'md'} />
      </div>

      {full ? (
        <div className="mt-5">
          <h4 className="text-micro font-semibold tracking-wide text-gray-900 uppercase">
            Who it&apos;s for
          </h4>
          <p className="text-small mt-1.5 text-gray-700">{pkg.whoFor}</p>
        </div>
      ) : null}

      <div className="mt-5 flex-1">
        {full ? (
          <h4 className="text-micro mb-2.5 font-semibold tracking-wide text-gray-900 uppercase">
            What&apos;s included
          </h4>
        ) : null}
        <ul className="space-y-2.5">
          {(full ? pkg.included : pkg.included.slice(0, 3)).map((item) => (
            <li key={item} className="text-small flex gap-2 font-normal text-gray-700">
              <Check className="text-success mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {full && pkg.notIncluded.length > 0 ? (
          <>
            <h4 className="text-micro mt-5 mb-2.5 font-semibold tracking-wide text-gray-900 uppercase">
              Not included
            </h4>
            <ul className="space-y-2.5">
              {pkg.notIncluded.map((item) => (
                <li key={item} className="text-small flex gap-2 font-normal text-gray-500">
                  <X className="mt-0.5 size-4 shrink-0 text-gray-300" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>

      {full ? (
        <p className="text-small mt-5 font-semibold text-gray-900">Delivery: {pkg.deliveryTime}</p>
      ) : null}

      <div className="mt-5 flex flex-col gap-2">
        <Button
          variant={pkg.popular ? 'secondary' : 'outline'}
          size="sm"
          fullWidth
          className="h-auto min-h-11 py-2.5 text-center"
          onClick={onSelect ? () => onSelect(pkg.id) : undefined}
          href={onSelect ? undefined : `/build?package=${pkg.id}`}
          aria-pressed={onSelect ? selected : undefined}
        >
          {`Choose ${pkg.name}`}
        </Button>
        {full ? (
          <Button
            href={`/build?package=${pkg.id}`}
            variant="ghost"
            size="sm"
            fullWidth
            className="h-auto min-h-11 py-2.5 text-center"
          >
            Design it in the builder
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
