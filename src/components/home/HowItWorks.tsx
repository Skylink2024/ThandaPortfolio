'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

const steps = [
  {
    title: 'Tell me about your business.',
    body: 'A quick WhatsApp chat or use the builder. Share your logo, photos and what you sell.',
  },
  {
    title: 'I build your site. No deposit.',
    body: 'You get a working preview link, usually within days.',
  },
  {
    title: 'You review and ask for changes.',
    body: 'Tell me what to tweak. We polish it together until it feels right.',
  },
  {
    title: 'You pay only when you approve.',
    body: 'Happy? Pay, and your website goes live on your domain.',
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 65%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const draw = reduced ? 1 : progress;

  return (
    <Section id="how-it-works" tone="default">
      <SectionHeading
        align="center"
        title="How pay-after works"
        subtitle="You see your website before you spend a cent."
      />

      <div className="relative">
        {/* Line tracks: vertical on mobile, horizontal on lg+ */}
        <div
          aria-hidden="true"
          className="bg-border absolute top-5 bottom-5 left-5 w-0.5 -translate-x-1/2 lg:hidden"
        />
        <motion.div
          aria-hidden="true"
          className="bg-blue absolute top-5 bottom-5 left-5 w-0.5 origin-top -translate-x-1/2 lg:hidden"
          style={{ scaleY: draw }}
        />
        <div
          aria-hidden="true"
          className="bg-border absolute top-5 right-[12.5%] left-[12.5%] hidden h-0.5 -translate-y-1/2 lg:block"
        />
        <motion.div
          aria-hidden="true"
          className="bg-blue absolute top-5 right-[12.5%] left-[12.5%] hidden h-0.5 origin-left -translate-y-1/2 lg:block"
          style={{ scaleX: draw }}
        />

        <ol ref={ref} className="relative grid gap-10 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, i) => (
            <li key={step.title} className="relative">
              <Reveal delay={reduced ? 0 : i * 0.08}>
                <div className="flex gap-5 lg:flex-col lg:items-center lg:gap-6 lg:text-center">
                  <span className="bg-blue font-heading relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full font-bold text-white shadow-[var(--shadow-glow)]">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-h3 text-gray-900">{step.title}</h3>
                    <p className="mt-2 text-gray-500">{step.body}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      <Reveal className="mt-12 flex justify-center">
        <Badge tone="success" className="text-small gap-2 px-4 py-2 tracking-normal normal-case">
          <ShieldCheck className="size-5" aria-hidden="true" />
          No deposit. No risk.
        </Badge>
      </Reveal>
    </Section>
  );
}
