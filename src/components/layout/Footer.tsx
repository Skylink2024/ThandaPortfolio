import Image from 'next/image';
import Link from 'next/link';
import { site } from '@data/site';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { SocialIcon } from '@/components/ui/SocialIcons';
import { CopyrightYear } from '@/components/layout/CopyrightYear';
import { whatsappLink } from '@/lib/whatsapp';
import { cn } from '@/lib/cn';

export interface FooterProps {
  className?: string;
}

const explore = [
  { label: 'Work', href: '/work' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Design your site', href: '/build' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

const services = [
  { label: 'Websites', href: '/pricing#websites' },
  { label: 'Online Shops', href: '/pricing#online-shops' },
  { label: 'SEO', href: '/pricing#seo' },
  { label: 'Google Business Profile', href: '/pricing#google-business' },
  { label: 'Care plans', href: '/pricing#care-plans' },
];

export function Footer({ className }: FooterProps) {
  const waHref = whatsappLink(
    site.whatsappNumber,
    "Hi Thanda, I found Brike Web and I'd like a website.",
  );

  return (
    <footer className={cn('relative overflow-hidden bg-navy text-white', className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--cyan-glow),var(--blue),transparent)] opacity-80"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_at_top,rgba(92,200,255,0.18),transparent_65%)]"
      />

      <div className="container-brike relative grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" aria-label="Brike Web home" className="inline-flex">
            <Image
              src="/logo.png"
              alt="Brike Web"
              width={140}
              height={77}
              className="h-10 w-auto brightness-0 invert"
            />
          </Link>
          <p className="mt-4 max-w-xs text-small text-white/75">{site.tagline}</p>
          <p className="mt-2 max-w-xs text-small text-white/55">
            Websites for small businesses. Cape Town, South Africa.
          </p>
        </div>

        <div>
          <p className="mb-3 text-micro text-white/50">Explore</p>
          <ul className="space-y-2">
            {explore.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-small hover:text-cyan-glow">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-micro text-white/50">Services</p>
          <ul className="space-y-2">
            {services.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-small hover:text-cyan-glow">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-micro text-white/50">Talk to me</p>
          <Button href={waHref} variant="whatsapp" size="sm" className="mb-4">
            WhatsApp
          </Button>
          <a
            href={`mailto:${site.email}`}
            className="block text-small hover:text-cyan-glow"
          >
            {site.email}
          </a>
          <p className="mt-2 text-small text-white/70">{site.location}</p>
          <p className="text-small text-white/70">{site.hours}</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-brike flex flex-col items-center justify-between gap-4 py-4 text-center text-small text-white/50 sm:flex-row sm:text-left">
          <p>
            © <CopyrightYear /> Brike Web. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            {site.socials.map((social) => {
              if (social.placeholder) {
                return (
                  <Tooltip key={social.label} content="Coming soon">
                    <span
                      aria-disabled="true"
                      className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 text-white/40"
                    >
                      <SocialIcon name={social.label} className="size-4" />
                      <span className="sr-only">{social.label} coming soon</span>
                    </span>
                  </Tooltip>
                );
              }

              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-cyan-glow hover:text-cyan-glow"
                >
                  <SocialIcon name={social.label} className="size-4" />
                </a>
              );
            })}
          </div>

          <p>Built by Thanda, obviously.</p>
        </div>
      </div>
    </footer>
  );
}
