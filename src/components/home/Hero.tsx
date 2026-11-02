'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { getPackage } from '@/lib/pricing';
import { formatZAR } from '@/lib/format';
import { whatsappLink } from '@/lib/whatsapp';
import { site } from '@data/site';
import { HeroMockupCycler } from './HeroMockupCycler';

const facts = [
  { label: 'Deposit', value: 'R0' },
  { label: 'Websites from', value: formatZAR(getPackage('starter').price) },
  { label: 'Delivery', value: '3–10 days' },
];

export function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-6%']);

  const waHref = whatsappLink(
    site.whatsappNumber,
    "Hi Thanda, I found Brike Web and I'd like a website.",
  );

  return (
    <section
      ref={ref}
      id="hero"
      className="bg-navy-900 relative isolate -mt-[72px] overflow-hidden pt-28 pb-16 text-white md:pt-44 md:pb-28"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <img
          src="/hero-gradient.jpg"
          alt=""
          width={960}
          height={540}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </div>
      <div aria-hidden="true" className="hero-scrim absolute inset-0 -z-10" />

      <motion.div
        style={reduced ? undefined : { y: contentY }}
        className="container-brike grid items-center gap-14 lg:grid-cols-12 lg:gap-10"
      >
        <div className="min-w-0 lg:col-span-6">
          <h1 className="text-display text-white [text-shadow:0_2px_24px_rgba(6,19,37,0.55)]">
            <span className="block tracking-[-0.05em]">Your website first.</span>
            <span className="mt-2 block text-[0.46em] leading-[1.15] font-medium tracking-[-0.03em] text-white/80 sm:mt-3 sm:text-[0.42em]">
              You pay when you{' '}
              <span className="text-white underline decoration-[#5cc8ff] decoration-2 underline-offset-[0.18em]">
                love it
              </span>
              .
            </span>
          </h1>

          <p className="text-lead mt-6 max-w-xl text-white">
            Modern websites for Cape Town small businesses, designed and built by me in days, not
            months. No deposit, no risk.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center">
            <MagneticButton
              href="/build"
              size="lg"
              variant="secondary"
              strength={0.15}
              fullWidth
              className="!bg-white !text-navy-900 w-full shadow-[0_18px_40px_-14px_rgba(255,255,255,0.45)] hover:!bg-white/90 sm:w-auto"
              icon={<ArrowRight className="size-4" />}
              iconPosition="right"
            >
              Design my website
            </MagneticButton>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-dark inline-flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-md)] px-6 text-base font-semibold text-white transition hover:bg-white/15 sm:h-14 sm:w-auto"
            >
              <WhatsAppIcon className="text-whatsapp size-5" />
              WhatsApp me
            </a>
          </div>

          <dl className="mt-10 grid max-w-xl grid-cols-1 gap-2 min-[480px]:grid-cols-3 min-[480px]:gap-3">
            {facts.map((f) => (
              <div
                key={f.label}
                className="glass-dark flex items-center justify-between gap-4 rounded-[var(--radius-lg)] px-4 py-3 min-[480px]:block min-[480px]:py-4"
              >
                <dt className="text-xs font-semibold tracking-wide text-white/80">{f.label}</dt>
                <dd className="font-heading text-lg font-semibold tracking-tight text-white min-[480px]:mt-1.5 sm:text-2xl">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="min-w-0 lg:col-span-6">
          <HeroMockupCycler />
        </div>
      </motion.div>
    </section>
  );
}
