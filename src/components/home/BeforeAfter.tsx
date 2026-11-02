'use client';

import dynamic from 'next/dynamic';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

// Code-split the slider; the placeholder reserves the same aspect ratio (no layout shift).
const BeforeAfterDemo = dynamic(() => import('./BeforeAfterDemo'), {
  loading: () => (
    <div className="bg-surface-2 aspect-[4/3] w-full animate-pulse rounded-[var(--radius-lg)] sm:aspect-[16/10]" />
  ),
});

export function BeforeAfter() {
  return (
    <Section id="before-after" tone="surface">
      <SectionHeading
        eyebrow="Before & after"
        title="From outdated to outstanding."
        subtitle="Drag the slider to see the difference a modern website makes."
      />
      <Reveal>
        <BeforeAfterDemo />
        <p className="text-small mt-4 text-gray-700">
          Example design: a fictional business, not a client.
        </p>
      </Reveal>
    </Section>
  );
}
