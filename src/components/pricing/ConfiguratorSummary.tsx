'use client';

import Link from 'next/link';
import { Check, Mail, MessageCircleWarning } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Price } from '@/components/ui/Price';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { formatZAR } from '@/lib/format';
import { track } from '@/lib/analytics';
import type { Quote } from '@/lib/pricing';
import { buildCustomQuoteMessage, buildQuoteWhatsappLink, siteWhatsappLink } from '@/lib/whatsapp';

export interface ConfiguratorSummaryProps {
  quote: Quote;
  /** Link that carries the selection to /build. */
  buildHref: string;
  onEmail(): void;
}

function lineAmount(amount: number, billing: Quote['lines'][number]['billing'], note?: string) {
  if (note?.startsWith('Included')) return 'Included';
  if (billing === 'month') return `${formatZAR(amount)}/month`;
  if (billing === 'year') return `${formatZAR(amount)}/year`;
  if (billing === 'hour') return `${formatZAR(amount)}/hour`;
  return formatZAR(amount);
}

export function ConfiguratorSummary({ quote, buildHref, onEmail }: ConfiguratorSummaryProps) {
  const { overCap } = quote;

  return (
    <div className="border-border bg-bg rounded-[var(--radius-lg)] border p-5 shadow-[var(--shadow-md)] sm:p-6">
      <h3 className="text-h3 text-gray-900">Your quote</h3>

      <ul className="divide-border mt-4 divide-y" aria-label="Quote items">
        {quote.lines.map((line) => {
          const included = line.note?.startsWith('Included');
          // Over the cap we never show once-off amounts.
          const hideAmount = overCap && line.billing === 'once' && !included;
          return (
            <li key={line.id} className="text-small flex items-start justify-between gap-3 py-2.5">
              <span className="min-w-0 text-gray-700">
                {line.label}
                {line.note && !included ? (
                  <span className="text-micro block text-gray-500">{line.note}</span>
                ) : null}
              </span>
              {hideAmount ? null : (
                <span
                  className={
                    included
                      ? 'text-success inline-flex shrink-0 items-center gap-1 font-semibold'
                      : 'shrink-0 font-mono font-medium text-gray-900'
                  }
                >
                  {included ? <Check className="size-3.5" aria-hidden="true" /> : null}
                  {lineAmount(line.amount, line.billing, line.note)}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {quote.autoAdded.length > 0 ? (
        <ul className="text-small bg-blue-100 text-blue mt-3 space-y-1 rounded-[var(--radius-md)] p-3">
          {quote.autoAdded.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}

      <div className="border-border mt-4 space-y-3 border-t pt-4">
        {overCap ? (
          <div
            role="status"
            className="border-warning/40 bg-warning/10 rounded-[var(--radius-md)] border p-4"
          >
            <p className="font-heading flex items-start gap-2 text-lg font-bold text-gray-900">
              <MessageCircleWarning className="text-warning mt-0.5 size-5 shrink-0" aria-hidden="true" />
              Let&apos;s chat, I&apos;ll give you a custom quote.
            </p>
            <p className="text-small mt-2 text-gray-700">
              Your selection is a bigger project. Message me and I&apos;ll put together a fair price.
            </p>
            <Button
              href={siteWhatsappLink(buildCustomQuoteMessage(quote))}
              variant="whatsapp"
              size="md"
              fullWidth
              icon={<WhatsAppIcon />}
              className="mt-4"
              onClick={() => track('configurator_whatsapp')}
            >
              Chat on WhatsApp
            </Button>
          </div>
        ) : (
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-semibold text-gray-900">Once-off total</span>
            <Price amount={quote.onceOff} animate size="lg" period="once" />
          </div>
        )}

        <div className="text-small flex items-baseline justify-between gap-3 text-gray-700">
          <span>Monthly</span>
          <span className="font-mono font-medium text-gray-900">
            {formatZAR(quote.monthly)}/month
          </span>
        </div>
        {quote.yearly > 0 ? (
          <div className="text-small flex items-baseline justify-between gap-3 text-gray-700">
            <span>Yearly (domain)</span>
            <span className="font-mono font-medium text-gray-900">
              {formatZAR(quote.yearly)}/year
            </span>
          </div>
        ) : null}
      </div>

      <p className="text-small text-success mt-4 flex items-center gap-2 font-semibold">
        <Check className="size-4 shrink-0" aria-hidden="true" />
        Pay nothing until you approve your website.
      </p>

      {overCap ? (
        <div className="mt-5">
          <Button variant="outline" size="md" fullWidth icon={<Mail className="size-5" />} onClick={onEmail}>
            Email me this quote
          </Button>
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-3">
          <Button
            href={buildQuoteWhatsappLink(quote)}
            variant="whatsapp"
            size="md"
            fullWidth
            icon={<WhatsAppIcon />}
            onClick={() => track('configurator_whatsapp')}
          >
            Send me this quote on WhatsApp
          </Button>
          <Button variant="outline" size="md" fullWidth icon={<Mail className="size-5" />} onClick={onEmail}>
            Email me this quote
          </Button>
        </div>
      )}

      <p className="mt-4 text-center">
        <Link
          href={buildHref}
          className="text-blue text-small font-semibold underline-offset-4 hover:underline"
        >
          Want to see it? Design it in the builder →
        </Link>
      </p>
    </div>
  );
}
