import type { Metadata } from 'next';
import { Configurator } from '@/components/pricing/Configurator';
import { ExtrasTable } from '@/components/pricing/ExtrasTable';
import { PackageGrid } from '@/components/pricing/PackageGrid';
import { PayAfterTimeline } from '@/components/pricing/PayAfterTimeline';
import { FinalCta } from '@/components/home/FinalCta';
import { Accordion } from '@/components/ui/Accordion';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { faqs } from '@data/faq';
import { extras, ONCE_OFF_CAP } from '@data/pricing';
import { formatZAR } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Website Prices in South Africa',
  description:
    'Honest website prices in Rand from R2,500. No deposit, nothing to pay until you approve your website. No once-off quote goes above R15,000.',
  alternates: { canonical: '/pricing' },
};

const meanings = [
  {
    title: 'Once-off',
    body: 'You pay this one time, after you approve your site.',
  },
  {
    title: 'Monthly',
    // TODO(Thanda): confirm notice period
    body: 'Hosting and care keep your website online, safe and up to date. Cancel any time with 30 days notice.',
  },
  {
    title: 'Yearly',
    body: 'Your domain name renews once a year.',
  },
];

function price(id: (typeof extras)[number]['id']) {
  return formatZAR(extras.find((e) => e.id === id)!.price);
}

export default function PricingPage() {
  const pricingFaqs = faqs
    .filter((f) => f.tags.includes('pricing'))
    .slice(0, 4)
    .map(({ id, question, answer }) => ({ id, question, answer }));

  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Honest prices. Pay only when you love it."
        subtitle={
          <>
            Every price is once-off in Rand unless it says per month. No deposit. Nothing to pay
            until you approve your website. No once-off quote goes above{' '}
            {formatZAR(ONCE_OFF_CAP)}.
          </>
        }
      />

      <Section id="packages-section" tone="default" className="scroll-mt-20">
        <PackageGrid />
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="Billing" title="What do the prices mean?" />
        <ul className="grid gap-10 md:grid-cols-3">
          {meanings.map((m, i) => (
            <Reveal as="li" key={m.title} delay={i * 0.06} className="border-gray-900 border-t pt-6">
              <h3 className="text-h3 text-gray-900">{m.title}</h3>
              <p className="mt-2 text-gray-700">{m.body}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <ExtrasTable />

      <Section id="google" tone="default" className="scroll-mt-20">
        <Reveal className="max-w-3xl">
          <p className="text-micro mb-5 text-gray-500">Google</p>
          <h2 className="text-h2 text-gray-900">SEO and Google Business, explained simply</h2>
          <div className="mt-6 space-y-4 text-lg text-gray-700">
            <p>
              Google Business Profile is the box that shows your business on Google Maps and
              Search, with your hours, photos and reviews. Setup is {price('gbpSetup')} once-off,
              and I can keep it active for {price('gbpCare')}/month.
            </p>
            <p>
              SEO means setting up your website so Google understands it and shows it to people
              searching for what you do. A full setup is {price('seoOnce')} once-off, and Local
              SEO at {price('localSeo')}/month keeps pushing you up in your area.
            </p>
            <p>
              Want both? The Google Starter bundle gives you SEO once-off plus Google Business
              Profile setup for {price('googleStarter')}.
            </p>
          </div>
        </Reveal>
      </Section>

      <PayAfterTimeline />

      <Configurator />

      <Section id="pricing-faq" tone="surface">
        <SectionHeading eyebrow="FAQ" title="Pricing questions, answered" />
        <Reveal className="max-w-3xl">
          <Accordion items={pricingFaqs} />
        </Reveal>
      </Section>

      <FinalCta />
    </>
  );
}
