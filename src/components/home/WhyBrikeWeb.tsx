import {
  Code2,
  KeyRound,
  MapPin,
  ShieldCheck,
  Smartphone,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/cn';
import { SpotlightCard } from './SpotlightCard';

const reasons: { title: string; body: string; Icon: LucideIcon; large?: boolean }[] = [
  {
    title: 'No deposit, pay after approval.',
    body: "You only pay when you've seen it and love it. Zero risk to you.",
    Icon: ShieldCheck,
    large: true,
  },
  {
    title: 'Fast delivery.',
    body: 'Most websites are ready in days, not months.',
    Icon: Zap,
    large: true,
  },
  {
    title: 'Local Cape Town support.',
    body: 'Real person, same time zone, quick WhatsApp replies.',
    Icon: MapPin,
  },
  {
    title: '4+ years of experience.',
    body: 'Modern, fast websites built with the same tools big companies use.',
    Icon: Code2,
  },
  {
    title: 'Mobile-first and Google ready.',
    body: 'Looks great on every phone and is set up so customers can find you.',
    Icon: Smartphone,
  },
  {
    title: 'You own it.',
    body: 'Your domain, your content, your website. No lock-in.',
    Icon: KeyRound,
  },
];

export function WhyBrikeWeb() {
  return (
    <Section id="why-brike-web" tone="surface">
      <SectionHeading align="center" title="Why small businesses choose Brike Web" />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {reasons.map(({ title, body, Icon, large }, i) => (
          <li key={title} className={cn(large && 'lg:col-span-2')}>
            <Reveal delay={Math.min(i, 3) * 0.06} className="h-full">
              <SpotlightCard className={cn('h-full', large && 'lg:p-8')}>
                <span className="text-blue flex size-12 items-center justify-center rounded-full bg-blue-100">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className={cn('mt-5 text-gray-900', large ? 'text-h3 lg:text-2xl' : 'text-h3')}>
                  {title}
                </h3>
                <p className={cn('mt-2 text-gray-500', large && 'lg:text-lead')}>{body}</p>
              </SpotlightCard>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
