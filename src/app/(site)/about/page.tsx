import type { Metadata } from 'next';
import Image from 'next/image';
import { FinalCta } from '@/components/home/FinalCta';
import { WhyBrikeWeb } from '@/components/home/WhyBrikeWeb';
import { PayAfterTimeline } from '@/components/pricing/PayAfterTimeline';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SocialIcon, type SocialIconName } from '@/components/ui/SocialIcons';
import { getPublicAbout, portraitSrc, socialsFromAbout } from '@/lib/public-content';
import { site } from '@data/site';

export const metadata: Metadata = {
  title: 'Meet Thanda Manuel',
  description:
    'Meet Thanda Manuel, the web developer behind Brike Web in Cape Town. Modern websites with no deposit — you pay when you love it.',
  alternates: { canonical: '/about' },
};

const beliefs = [
  { title: 'Keep my word.', body: "If I say it's done Friday, it's done Friday." },
  { title: 'Results over fluff.', body: 'Every website must bring you customers, not just look nice.' },
  { title: 'You come first.', body: 'You see your site before you pay. Always.' },
] as const;

const tools = [
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Tailwind CSS',
  'Node.js',
  'Figma',
  'Vercel',
] as const;

export default async function AboutPage() {
  const about = await getPublicAbout();
  const socials = socialsFromAbout(about);
  const photoSrc = portraitSrc(about);
  const remote = photoSrc.startsWith('http');
  const bio = about.bio?.trim() || site.about;
  const name = about.name?.trim() || site.owner;

  return (
    <>
      <section className="bg-bg pt-28 pb-[var(--section-pad-y)] md:pt-40">
        <div className="container-brike grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="border-border bg-surface-2 relative overflow-hidden rounded-[var(--radius-lg)] border">
              <Image
                src={photoSrc}
                alt={name}
                width={800}
                height={1000}
                className="aspect-[4/5] w-full object-cover"
                priority
                unoptimized={remote}
              />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7 lg:pt-6">
            <p className="text-micro flex items-center gap-3 text-gray-700">
              <span aria-hidden="true" className="bg-gray-900 h-px w-8" />
              About Brike Web
            </p>
            <h1 className="text-display mt-6 text-gray-900">Meet {name}</h1>
            {about.headline ? (
              <p className="text-lead mt-6 text-gray-900">{about.headline}</p>
            ) : null}
            <p className="mt-6 text-lg leading-relaxed whitespace-pre-wrap text-gray-700">{bio}</p>
            <div className="border-border mt-10 flex flex-wrap gap-3 border-t pt-8">
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
          </Reveal>
        </div>
      </section>

      <Section tone="default">
        <SectionHeading eyebrow="Principles" title="What I believe" />
        <ul className="grid gap-10 md:grid-cols-3">
          {beliefs.map((b, i) => (
            <Reveal as="li" key={b.title} delay={i * 0.06} className="border-gray-900 border-t pt-6">
              <h2 className="text-h3 text-gray-900">{b.title}</h2>
              <p className="mt-3 text-gray-700">{b.body}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <WhyBrikeWeb />

      <PayAfterTimeline />

      <Section tone="default">
        <SectionHeading eyebrow="Toolkit" title="Tools I use" />
        <ul className="flex flex-wrap gap-2">
          {tools.map((t) => (
            <li
              key={t}
              className="border-border rounded-full border px-4 py-2 text-sm text-gray-700"
            >
              {t}
            </li>
          ))}
        </ul>
      </Section>

      <FinalCta />
    </>
  );
}
