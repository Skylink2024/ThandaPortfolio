import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { site } from '@data/site';
import { whatsappLink } from '@/lib/whatsapp';

export function FinalCta() {
  const waHref = whatsappLink(
    site.whatsappNumber,
    "Hi Thanda, I found Brike Web and I'd like a website.",
  );

  return (
    <section id="final-cta" className="bg-navy-900 relative isolate overflow-hidden text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <img
          src="/hero-gradient.jpg"
          alt=""
          width={960}
          height={540}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-60"
        />
        <div className="cta-scrim absolute inset-0" />
      </div>
      <div className="container-brike py-[var(--section-pad-y)]">
        <Reveal>
          <p className="text-micro flex items-center gap-3 text-white/70">
            <span aria-hidden="true" className="h-px w-8 bg-white/50" />
            Start a project
          </p>
          <h2 className="text-display mt-6 max-w-4xl text-white [text-shadow:0_2px_24px_rgba(10,26,54,0.55)]">
            Ready to see your <span className="accent-word on-dark">website</span> before you pay?
          </h2>
          <div className="mt-12 grid gap-8 border-t border-white/20 pt-8 md:grid-cols-12 md:items-center">
            <p className="text-lead text-white/85 md:col-span-6">
              Design it now or send me a message. I usually reply the same day.
            </p>
            <div className="flex w-full flex-col gap-3 sm:flex-row md:col-span-6 md:justify-end">
              <Button
                href="/build"
                size="lg"
                icon={<ArrowRight className="size-4" />}
                iconPosition="right"
                className="w-full sm:w-auto"
              >
                Design my website
              </Button>
              <Button
                href={waHref}
                size="lg"
                variant="whatsapp"
                icon={<WhatsAppIcon className="size-5" />}
                className="w-full sm:w-auto"
              >
                WhatsApp me
              </Button>
            </div>
          </div>
          <p className="text-small mt-8 text-white/70">
            Or email{' '}
            <a href={`mailto:${site.email}`} className="link-draw text-white">
              {site.email}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
