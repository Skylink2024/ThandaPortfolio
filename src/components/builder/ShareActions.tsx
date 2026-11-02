'use client';

import { useState } from 'react';
import { CheckCircle2, Copy, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { track } from '@/lib/analytics';
import { quotePayloadSchema } from '@/lib/quote';
import type { Quote } from '@/lib/pricing';
import type { SharedDesign } from '@/lib/share';
import { buildDesignWhatsappLink } from '@/lib/whatsapp';
import { site } from '@data/site';

export function ShareActions({
  quote,
  shareUrl,
  designCode,
  design,
  businessName,
  industry,
  location,
  presetName,
  primary,
  accent,
  pageLabels,
  featureLabels,
  extraLabels,
  onEdit,
}: {
  quote: Quote;
  shareUrl: string;
  designCode: string;
  design: SharedDesign;
  businessName: string;
  industry: string;
  location: string;
  presetName: string;
  primary: string;
  accent: string;
  pageLabels: string[];
  featureLabels: string[];
  extraLabels: string[];
  onEdit: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const waHref = buildDesignWhatsappLink({
    businessName,
    industry,
    location,
    presetName,
    primary,
    accent,
    pages: pageLabels,
    features: featureLabels,
    extras: extraLabels,
    quote,
    shareUrl,
  });

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      track('builder_share', { method: 'link' });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function onEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      source: 'builder' as const,
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      phone: String(form.get('phone') ?? '') || undefined,
      businessName,
      industry,
      packageId: quote.package.id,
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
      design,
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
      track('builder_share', { method: 'email' });
    } catch {
      setError('Something went wrong. Please WhatsApp me instead.');
      setStatus('error');
    }
  }

  return (
    <div className="space-y-3">
      <Button
        href={waHref}
        variant="whatsapp"
        fullWidth
        size="lg"
        icon={<WhatsAppIcon />}
        onClick={() => track('builder_share', { method: 'whatsapp' })}
      >
        Send my design & quote on WhatsApp
      </Button>
      <Button
        type="button"
        variant="outline"
        fullWidth
        icon={<Mail className="size-4" />}
        onClick={() => setEmailOpen(true)}
      >
        Email me my design
      </Button>
      <Button
        type="button"
        variant="ghost"
        fullWidth
        icon={copied ? <CheckCircle2 className="size-4" /> : <Copy className="size-4" />}
        onClick={copyLink}
      >
        {copied ? 'Link copied' : 'Copy share link'}
      </Button>
      <Button href={`/contact?design=${encodeURIComponent(designCode)}`} fullWidth>
        Start my website, no deposit
      </Button>
      <Button type="button" variant="outline" fullWidth onClick={onEdit}>
        Edit design
      </Button>

      <Dialog
        open={emailOpen}
        onClose={() => {
          setEmailOpen(false);
          setStatus('idle');
          setError(null);
        }}
        title="Email me my design"
      >
        {status === 'sent' ? (
          <div className="py-4 text-center" role="status">
            <CheckCircle2 className="text-success mx-auto size-12" aria-hidden />
            <p className="mt-3 font-semibold text-gray-900">
              Sent! I&apos;ll reply within one working day.
            </p>
          </div>
        ) : (
          <form onSubmit={onEmail} className="space-y-3" noValidate>
            <input
              type="text"
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden
            />
            {(['name', 'email', 'phone'] as const).map((field) => (
              <label key={field} className="block">
                <span className="text-micro text-gray-500">
                  {field === 'name' ? 'Name' : field === 'email' ? 'Email' : 'Phone (optional)'}
                </span>
                <input
                  name={field}
                  type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                  required={field !== 'phone'}
                  className="border-border bg-bg mt-2 h-12 w-full rounded-[var(--radius-md)] border px-4"
                />
              </label>
            ))}
            {error ? <p className="text-danger text-sm">{error}</p> : null}
            <Button type="submit" fullWidth loading={status === 'sending'}>
              Send design
            </Button>
            <p className="text-xs text-gray-500">
              Or WhatsApp {site.owner} directly if email fails.
            </p>
          </form>
        )}
      </Dialog>
    </div>
  );
}
