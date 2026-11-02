'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SocialIcon, type SocialIconName } from '@/components/ui/SocialIcons';
import type { AboutSettings } from '@/lib/types';
import type { SocialLink } from '@data/site';
import { site } from '@data/site';

function firstSentences(text: string, count: number) {
  const parts = text.split(/(?<=[.!?])\s+/);
  return parts.slice(0, count).join(' ');
}

export function MeetThanda({
  about,
  socials,
  photoSrc,
  index,
}: {
  about: AboutSettings;
  socials: SocialLink[];
  photoSrc: string;
  index?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);
  const remote = photoSrc.startsWith('http');

  return (
    <Section id="meet-thanda" tone="default">
      <div className="grid items-center gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
        <Reveal>
          <div
            ref={ref}
            className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface-2 shadow-[var(--shadow-md)]"
          >
            <motion.div
              className="absolute inset-x-0 top-[-6%] bottom-[-6%]"
              style={reduced ? undefined : { y }}
            >
              <Image
                src={photoSrc}
                alt={`Portrait of ${about.name || site.owner}, founder of ${site.name}`}
                fill
                sizes="(min-width: 1024px) 384px, 90vw"
                className="object-cover"
                unoptimized={remote}
              />
            </motion.div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-micro flex items-center gap-3 text-gray-700">
            {index ? <span className="text-gray-900 tabular-nums">{index}</span> : null}
            {index ? <span aria-hidden="true" className="bg-gray-300 h-px w-8" /> : null}
            The person behind Brike Web
          </p>
          <h2 className="text-h2 mt-3 text-gray-900">Meet {about.name || site.owner}</h2>
          <p className="text-lead mt-5 text-gray-700">
            {firstSentences(about.bio || site.about, 3)}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {socials.map((s) => (
              <Button
                key={s.label}
                href={s.href}
                variant="outline"
                size="sm"
                icon={<SocialIcon name={s.label as SocialIconName} className="size-4" />}
              >
                {s.label}
              </Button>
            ))}
          </div>
          <p className="mt-6">
            <Link
              href="/about"
              className="text-blue font-semibold underline-offset-4 hover:underline"
            >
              Read my story →
            </Link>
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
