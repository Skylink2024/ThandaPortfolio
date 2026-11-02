'use client';

import { Fragment } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Button } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { site } from '@data/site';
import { whatsappLink } from '@/lib/whatsapp';
import { wordReveal, wordRevealChild } from '@/lib/motion';
import { HeroMockupCycler } from './HeroMockupCycler';
import { Spotlight } from './Spotlight';

const headlineWords: { word: string; gradient?: boolean }[] = [
  { word: 'Your' },
  { word: 'website' },
  { word: 'first.' },
  { word: 'You' },
  { word: 'pay', gradient: true },
  { word: 'when', gradient: true },
  { word: 'you', gradient: true },
  { word: 'love', gradient: true },
  { word: 'it.', gradient: true },
];

const trust = ['R0 deposit', 'From R2,500', 'Pay after approval'];

function HeroBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="hero-blob hero-blob-a bg-navy-700 -top-24 -left-24 size-[420px] opacity-25 md:size-[560px]" />
      <div className="hero-blob hero-blob-b bg-blue top-1/4 -right-24 size-[380px] opacity-25 md:size-[520px]" />
      <div className="hero-blob hero-blob-c bg-cyan-glow -bottom-32 left-1/3 size-[340px] opacity-25 md:size-[460px]" />
      <div className="hero-grid absolute inset-0" />
      <div className="hero-noise absolute inset-0" />
    </div>
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  const waHref = whatsappLink(
    site.whatsappNumber,
    "Hi Thanda, I found Brike Web and I'd like a website.",
  );

  return (
    <section
      id="hero"
      className="bg-bg relative overflow-hidden pt-28 pb-20 md:pt-36 lg:pt-40 lg:pb-28"
    >
      <HeroBackground />
      <Spotlight />

      <div className="container-brike relative grid items-center gap-14 lg:grid-cols-[55fr_45fr] lg:gap-10">
        <div className="text-center lg:text-left">
          <p className="text-micro text-blue">Web design · Cape Town</p>

          <motion.h1
            className="text-display mt-4 text-gray-900"
            variants={wordReveal}
            initial={reduced ? false : 'hidden'}
            animate="visible"
            aria-label="Your website first. You pay when you love it."
          >
            {headlineWords.map(({ word, gradient }, i) => (
              <Fragment key={`${word}-${i}`}>
                <span
                  aria-hidden="true"
                  className="inline-block overflow-hidden pb-[0.12em] align-bottom"
                >
                  <motion.span
                    variants={wordRevealChild}
                    className={gradient ? 'text-gradient-brand inline-block' : 'inline-block'}
                  >
                    {word}
                  </motion.span>
                </span>{' '}
              </Fragment>
            ))}
          </motion.h1>

          <p className="text-lead mx-auto mt-6 max-w-xl text-gray-700 lg:mx-0">
            Affordable, modern websites for Cape Town small businesses, built in days, not months.
            No deposit. No risk.
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
            <MagneticButton href="/build" size="lg" className="w-full sm:w-auto" fullWidth>
              Design my website
            </MagneticButton>
            <Button
              href="/pricing#configurator"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              Build my price
            </Button>
          </div>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-small hover:text-whatsapp mt-5 inline-flex items-center gap-2 font-semibold text-gray-700 transition-colors"
          >
            <WhatsAppIcon className="text-whatsapp size-5" />
            WhatsApp me
          </a>

          <ul className="text-small mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-gray-500 lg:justify-start">
            {trust.map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <Check className="text-success size-4" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <HeroMockupCycler />
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <span className="flex h-8 w-5 justify-center rounded-full border-2 border-gray-500/60 pt-1.5">
          <span className="brike-scroll-dot block size-1 rounded-full bg-gray-500" />
        </span>
      </div>
    </section>
  );
}
