'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { quotePayloadSchema, type QuotePayload } from '@/lib/quote';
import type { Quote } from '@/lib/pricing';
import { buildQuoteMessage, siteWhatsappLink } from '@/lib/whatsapp';

export interface QuoteModalProps {
  open: boolean;
  onClose(): void;
  quote: Quote;
  /** Absolute link to the builder with this selection. */
  shareUrl: string;
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

const inputClass =
  'border-border bg-bg focus-visible:outline-navy h-12 w-full rounded-[var(--radius-md)] border px-4 text-gray-900 placeholder:text-gray-500';

export function QuoteModal({ open, onClose, quote, shareUrl }: QuoteModalProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload: QuotePayload = {
      source: 'configurator',
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      phone: String(form.get('phone') ?? '') || undefined,
      packageId: quote.package.id,
      // Never send a number over the cap.
      onceOff: quote.overCap ? null : quote.onceOff,
      monthly: quote.monthly,
      yearly: quote.yearly,
      lines: quote.lines.map(({ id, label, amount, billing, note }) => ({
        id,
        label,
        amount,
        billing,
        note,
      })),
      shareUrl,
      createdAt: new Date().toISOString(),
      company_website: String(form.get('company_website') ?? ''),
    };

    const parsed = quotePayloadSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Please check your details.');
      setStatus('error');
      return;
    }

    setStatus('sending');
    setError(null);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? 'Something went wrong. Please WhatsApp me instead.');
        setStatus('error');
        return;
      }
      setStatus('sent');
    } catch {
      setError('Something went wrong. Please WhatsApp me instead.');
      setStatus('error');
    }
  }

  function close() {
    onClose();
    // Reset after the exit animation so reopening starts fresh.
    window.setTimeout(() => {
      setStatus('idle');
      setError(null);
    }, 350);
  }

  return (
    <Dialog open={open} onClose={close} title="Email me this quote">
      {status === 'sent' ? (
        <div className="py-4 text-center" role="status">
          <CheckCircle2 className="text-success mx-auto size-12" aria-hidden="true" />
          <p className="font-heading mt-3 text-xl font-bold text-gray-900">
            Sent! I&apos;ll reply within one working day.
          </p>
          <Button className="mt-6" onClick={close} data-autofocus>
            Close
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="quote-name" className="text-small mb-1.5 block font-semibold text-gray-900">
              Name
            </label>
            <input
              id="quote-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              data-autofocus
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="quote-email" className="text-small mb-1.5 block font-semibold text-gray-900">
              Email
            </label>
            <input
              id="quote-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="quote-phone" className="text-small mb-1.5 block font-semibold text-gray-900">
              Phone <span className="font-normal text-gray-500">(optional)</span>
            </label>
            <input
              id="quote-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className={inputClass}
            />
          </div>
          {/* Honeypot: hidden from people, bots fill it in. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="quote-company-website">Company website</label>
            <input
              id="quote-company-website"
              name="company_website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {error ? (
            <div role="alert" className="text-small text-danger space-y-3">
              <p>{error}</p>
              <Button
                href={siteWhatsappLink(buildQuoteMessage(quote))}
                variant="whatsapp"
                size="sm"
                icon={<WhatsAppIcon />}
              >
                WhatsApp me instead
              </Button>
            </div>
          ) : null}

          <Button type="submit" fullWidth loading={status === 'sending'}>
            Send quote
          </Button>
          <p className="text-micro text-center text-gray-500">
            No spam. I only use your details to reply about this quote.
          </p>
        </form>
      )}
    </Dialog>
  );
}
