'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { payAfterSteps } from '@/components/home/payAfterSteps';
import { ease } from '@/lib/motion';

/** The 4 pay-after steps. Used on the homepage, pricing and about pages. */
export function PayAfterTimeline({
  index,
  tone = 'surface',
}: {
  index?: string;
  tone?: 'default' | 'surface';
}) {
  const reduced = useReducedMotion();

  return (
    <Section id="how-it-works" tone={tone}>
      <SectionHeading
        index={index}
        eyebrow="Process"
        title="How pay-after works"
        subtitle="You see your website before you spend a cent."
      />

      <ol className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {payAfterSteps.map((step, i) => (
          <li key={step.title} className="relative pt-6">
            <motion.span
              aria-hidden="true"
              className="bg-gray-900 absolute top-0 left-0 h-px w-full origin-left"
              initial={reduced ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.9, ease: ease.out, delay: i * 0.12 }}
            />
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: ease.out, delay: 0.15 + i * 0.12 }}
            >
              <span className="text-small text-gray-500 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-h3 mt-4 text-gray-900">{step.title}</h3>
              <p className="mt-2 text-gray-700">{step.body}</p>
            </motion.div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
