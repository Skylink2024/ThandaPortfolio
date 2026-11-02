import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

const reasons = [
  {
    title: 'No deposit, pay after approval.',
    body: "You only pay when you've seen it and love it. Zero risk to you.",
  },
  {
    title: 'Fast delivery.',
    body: 'Most websites are ready in days, not months.',
  },
  {
    title: 'Local Cape Town support.',
    body: 'Real person, same time zone, quick WhatsApp replies.',
  },
  {
    title: '4+ years of experience.',
    body: 'Modern, fast websites built with the same tools big companies use.',
  },
  {
    title: 'Mobile-first and Google ready.',
    body: 'Looks great on every phone and is set up so customers can find you.',
  },
  {
    title: 'You own it.',
    body: 'Your domain, your content, your website. No lock-in.',
  },
];

export function WhyBrikeWeb() {
  return (
    <Section id="why-brike-web" tone="default">
      <SectionHeading eyebrow="Why work with me" title="Why small businesses choose Brike Web" />
      <ul className="border-border grid border-t sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map(({ title, body }, i) => (
          <Reveal
            as="li"
            key={title}
            delay={(i % 3) * 0.06}
            className="border-border border-b py-8 sm:odd:pr-8 lg:pr-8"
          >
            <span className="text-small text-gray-500 tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="text-h3 mt-4 text-gray-900">{title}</h3>
            <p className="mt-2 text-gray-700">{body}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
