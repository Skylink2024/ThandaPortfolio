import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { formatZAR } from '@/lib/format';
import { getExtra, getPackage } from '@/lib/pricing';

const services = [
  {
    title: 'Business websites',
    body: 'One-page sites to full websites with services, gallery, Google Maps and a contact form.',
    price: `From ${formatZAR(getPackage('starter').price)}`,
    href: '/pricing#packages-section',
  },
  {
    title: 'Online shops',
    body: 'Product pages, PayFast or Yoco payments and an editor so you can update stock yourself.',
    price: `From ${formatZAR(getPackage('shop').price)}`,
    href: '/pricing#packages-section',
  },
  {
    title: 'Get found on Google',
    body: 'Google Business Profile, SEO setup and local SEO so nearby customers find you first.',
    price: `From ${formatZAR(getExtra('gbpSetup').price)}`,
    href: '/pricing#google',
  },
  {
    title: 'Hosting & care',
    body: 'Hosting, backups, updates and small edits, so your site stays fast and safe.',
    price: `From ${formatZAR(getExtra('hostingBasic').price)}/month`,
    href: '/pricing',
  },
];

export function Services({ index }: { index?: string }) {
  return (
    <Section id="services" tone="default">
      <SectionHeading
        index={index}
        eyebrow="Services"
        title="What I do"
        action={
          <Link href="/pricing" className="text-small link-draw font-semibold text-link">
            Full pricing →
          </Link>
        }
      />

      <ul className="border-border border-t">
        {services.map((s, i) => (
          <Reveal as="li" key={s.title} delay={i * 0.05}>
            <Link
              href={s.href}
              className="group border-border grid gap-3 border-b py-7 transition-colors md:grid-cols-12 md:items-baseline md:gap-6 md:py-9"
            >
              <span className="text-small text-gray-700 tabular-nums md:col-span-1">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-heading text-2xl font-extrabold tracking-tight text-gray-900 transition-transform duration-500 ease-out group-hover:translate-x-1 md:col-span-4 md:text-3xl">
                {s.title}
              </h3>
              <p className="text-gray-700 md:col-span-4">{s.body}</p>
              <span className="flex items-center justify-between gap-3 md:col-span-3 md:justify-end">
                <span className="font-mono text-sm font-semibold text-orange-ink">{s.price}</span>
                <ArrowUpRight
                  className="size-5 text-blue transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
