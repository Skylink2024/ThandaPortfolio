'use client';

import { useReducedMotion } from 'framer-motion';
import {
  Briefcase,
  BedDouble,
  Camera,
  Car,
  Coffee,
  Dumbbell,
  Hammer,
  Plane,
  Scissors,
  Sparkles,
  SprayCan,
  Store,
  UtensilsCrossed,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/cn';

interface Industry {
  label: string;
  Icon: LucideIcon;
}

const rowOne: Industry[] = [
  { label: 'Salons', Icon: Scissors },
  { label: 'Barbers', Icon: Scissors },
  { label: 'Restaurants', Icon: UtensilsCrossed },
  { label: 'Tour companies', Icon: Plane },
  { label: 'Cleaners', Icon: SprayCan },
  { label: 'Builders', Icon: Hammer },
  { label: 'Plumbers', Icon: Wrench },
  { label: 'Electricians', Icon: Zap },
];

const rowTwo: Industry[] = [
  { label: 'Coffee shops', Icon: Coffee },
  { label: 'Guest houses', Icon: BedDouble },
  { label: 'Beauty spas', Icon: Sparkles },
  { label: 'Personal trainers', Icon: Dumbbell },
  { label: 'Photographers', Icon: Camera },
  { label: 'Retail stores', Icon: Store },
  { label: 'Consultants', Icon: Briefcase },
  { label: 'Car washes', Icon: Car },
];

function Pill({ label, Icon }: Industry) {
  return (
    <span className="border-border bg-bg text-small inline-flex items-center gap-2 rounded-full border px-4 py-2 font-semibold whitespace-nowrap text-gray-700 shadow-[var(--shadow-sm)]">
      <Icon className="text-blue size-4" aria-hidden="true" />
      {label}
    </span>
  );
}

function Row({
  items,
  reverse,
  reduced,
  speed,
}: {
  items: Industry[];
  reverse?: boolean;
  reduced: boolean;
  speed: number;
}) {
  if (reduced) {
    return (
      <ul className="flex flex-wrap justify-center gap-3">
        {items.map((i) => (
          <li key={i.label}>
            <Pill {...i} />
          </li>
        ))}
      </ul>
    );
  }

  const loop = [...items, ...items];
  return (
    <div className="brike-mask-x overflow-hidden">
      <div
        className="brike-marquee flex w-max gap-3 pr-3"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {loop.map((i, idx) => (
          <span key={`${i.label}-${idx}`} aria-hidden={idx >= items.length || undefined}>
            <Pill {...i} />
          </span>
        ))}
      </div>
    </div>
  );
}

export function IndustryMarquee() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      aria-label="Built for businesses like yours"
      className="bg-bg overflow-hidden py-12 md:py-16"
    >
      <p className="text-micro text-blue mb-8 text-center">Built for businesses like yours</p>
      <div className={cn('flex flex-col gap-3', !reduced && 'brike-marquee-hover')}>
        <Row items={rowOne} reduced={reduced} speed={40} />
        <Row items={rowTwo} reduced={reduced} speed={46} reverse />
      </div>
    </section>
  );
}
