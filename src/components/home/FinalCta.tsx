import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { site } from '@data/site';
import { whatsappLink } from '@/lib/whatsapp';

export function FinalCta() {
  const waHref = whatsappLink(
    site.whatsappNumber,
    "Hi Thanda, I found Brike Web and I'd like a website.",
  );

  return (
    <Section id="final-cta" tone="default" className="!pt-0">
      <Reveal>
        <div
          className="relative overflow-hidden rounded-[var(--radius-xl)] px-6 py-14 text-center text-white shadow-[var(--shadow-lg)] sm:px-12 lg:py-20"
          style={{ background: 'var(--brand-gradient)' }}
        >
          <div
            aria-hidden="true"
            className="bg-cyan-glow pointer-events-none absolute -top-20 -right-20 size-80 rounded-full opacity-30 blur-[90px]"
          />
          <div className="relative">
            <h2 className="text-h1 mx-auto max-w-3xl text-white">
              Ready to see your website before you pay?
            </h2>
            <p className="text-lead mx-auto mt-5 max-w-xl text-white/85">
              Design it now or send me a message. I usually reply the same day.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Button
                href="/build"
                size="lg"
                className="!text-navy bg-white hover:bg-white hover:!shadow-[0_10px_40px_-10px_rgba(255,255,255,0.6)]"
              >
                Design my website
              </Button>
              <Button
                href={waHref}
                variant="whatsapp"
                size="lg"
                icon={<WhatsAppIcon className="size-5" />}
              >
                WhatsApp me
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
