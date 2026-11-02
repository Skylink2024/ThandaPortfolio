'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Price } from '@/components/ui/Price';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { cn } from '@/lib/cn';
import { packages } from '@data/pricing';
import { stylePresets } from '@data/builder';
import { MiniSite } from './MiniSite';
import { exampleDesigns } from './exampleDesigns';

const STEP_MS = 2600;

// Loop: pick a style -> preview restyles -> price ticks up (Starter -> Business -> Get Found on Google).
const frames = [
  { design: exampleDesigns[0]!, pkgId: 'starter' },
  { design: exampleDesigns[1]!, pkgId: 'business' },
  { design: exampleDesigns[2]!, pkgId: 'google' },
] as const;

const chipPresets = ['bold', 'playful', 'luxury'] as const;

export function BuilderTeaser() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % frames.length), STEP_MS);
    return () => window.clearInterval(id);
  }, [reduced]);

  const frame = frames[step]!;
  const pkg = packages.find((p) => p.id === frame.pkgId)!;

  return (
    <Section id="builder-teaser" tone="default" className="!pt-0">
      <Reveal>
        <div className="bg-navy relative overflow-hidden rounded-[var(--radius-xl)] p-6 text-white shadow-[var(--shadow-lg)] sm:p-10 lg:p-14">
          <div
            aria-hidden="true"
            className="bg-blue pointer-events-none absolute -top-24 -right-24 size-96 rounded-full opacity-40 blur-[100px]"
          />
          <div
            aria-hidden="true"
            className="bg-cyan-glow pointer-events-none absolute -bottom-32 -left-16 size-80 rounded-full opacity-20 blur-[100px]"
          />

          <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="text-center lg:text-left">
              <h2 className="text-h2 text-white">Design your website in 3 minutes.</h2>
              <p className="text-lead mt-4 text-white/75">
                Pick a style, choose your pages, add features, and watch your price update live. No
                sign-up needed.
              </p>
              <div className="mt-8">
                <Button href="/build" size="lg" className="w-full sm:w-auto">
                  Start designing
                </Button>
              </div>
            </div>

            <div
              className="bg-navy-900/70 mx-auto w-full max-w-md rounded-[var(--radius-lg)] border border-white/10 p-4"
              aria-hidden="true"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex gap-2">
                  {chipPresets.map((id, i) => {
                    const preset = stylePresets.find((p) => p.id === id)!;
                    return (
                      <span
                        key={id}
                        className={cn(
                          'text-small rounded-full border px-3 py-1 font-semibold transition-all duration-300',
                          i === step
                            ? 'border-blue bg-blue scale-105 text-white'
                            : 'border-white/20 text-white/60',
                        )}
                      >
                        {preset.name}
                      </span>
                    );
                  })}
                </div>
                <Badge tone="blue">Example design</Badge>
              </div>

              <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-md)] border border-white/10">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={frame.design.id}
                    className="absolute inset-0"
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <MiniSite design={frame.design} />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-[var(--radius-md)] bg-white/5 px-4 py-3">
                <span className="text-small text-white/70">Your price</span>
                <Price
                  amount={pkg.price}
                  animate
                  size="sm"
                  className="!text-white [&>span:nth-child(2)]:!text-white/60"
                />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
