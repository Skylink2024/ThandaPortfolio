'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { site } from '@data/site';

/** First three sentences of the About text, verbatim. */
function firstSentences(text: string, count: number) {
  const parts = text.split(/(?<=[.!?])\s+/);
  return parts.slice(0, count).join(' ');
}

export function MeetThanda() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <Section id="meet-thanda" tone="surface">
      <div className="grid items-center gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
        <Reveal>
          <div
            ref={ref}
            className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[var(--radius-xl)] shadow-[var(--shadow-glow)]"
          >
            <motion.div
              className="absolute inset-x-0 -inset-y-[8%]"
              style={reduced ? undefined : { y }}
            >
              <Image
                src="/thanda.jpg"
                alt={`Portrait of ${site.owner}, founder of ${site.name}`}
                fill
                sizes="(min-width: 1024px) 384px, 90vw"
                className="object-cover"
              />
            </motion.div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-micro text-blue">The person behind Brike Web</p>
          <h2 className="text-h2 mt-3 text-gray-900">Meet Thanda Manuel</h2>
          <p className="text-lead mt-5 text-gray-700">{firstSentences(site.about, 3)}</p>
          <p className="mt-6">
            <Link
              href="/about"
              className="text-blue font-semibold underline-offset-4 hover:underline"
            >
              Read my story →
            </Link>
          </p>
          <p
            className="font-heading mt-6 text-3xl font-extrabold text-gray-900 italic"
            aria-hidden="true"
          >
            Thanda
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
