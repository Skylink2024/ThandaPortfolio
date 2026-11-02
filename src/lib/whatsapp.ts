import { ONCE_OFF_CAP } from '@data/pricing';
import { site } from '@data/site';
import { formatZAR } from '@/lib/format';
import type { Quote } from '@/lib/pricing';

/** WhatsApp link builders. */
export function whatsappLink(number: string, message: string): string {
  const text = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${text}`;
}

/** WhatsApp link using the configured Brike Web number. */
export function siteWhatsappLink(message: string): string {
  return whatsappLink(site.whatsappNumber, message);
}

/**
 * Short-form quote message used by the pricing configurator (see spec 5.9 template).
 * Never includes a once-off number when the quote is over the R15,000 cap.
 */
export function buildQuoteMessage(quote: Quote): string {
  const pkg = quote.package;
  const extraLines = quote.lines.filter((l) => !l.id.startsWith('package:'));
  const extraNames = extraLines.map((l) =>
    l.note?.startsWith('Included') ? `${l.label} (included)` : l.label,
  );

  const onceOff = quote.overCap
    ? `Custom quote please (over ${formatZAR(ONCE_OFF_CAP)})`
    : formatZAR(quote.onceOff);

  const parts = [
    'Hi Thanda! I built a quote on Brike Web.',
    '',
    `Package: ${pkg.name} (${formatZAR(pkg.price)})`,
    `Extras: ${extraNames.length ? extraNames.join(', ') : 'None'}`,
    '',
    `Once-off total: ${onceOff}`,
    `Monthly: ${formatZAR(quote.monthly)}/month`,
    `Domain: ${formatZAR(quote.yearly)}/year`,
    '',
    "I understand there's no deposit and I pay when I approve. Can we start?",
  ];
  return parts.join('\n');
}

export function buildQuoteWhatsappLink(quote: Quote): string {
  return siteWhatsappLink(buildQuoteMessage(quote));
}

/** Message used by the "over cap" card so Thanda can price a bigger project. */
export function buildCustomQuoteMessage(quote: Quote): string {
  return [
    "Hi Thanda! I'd like a custom quote on Brike Web.",
    '',
    `Package: ${quote.package.name}`,
    `Selection: ${quote.lines.map((l) => l.label).join(', ')}`,
    '',
    'Can you put together a fair price for me?',
  ].join('\n');
}

export interface BuilderWhatsappInput {
  businessName: string;
  industry: string;
  location: string;
  presetName: string;
  primary: string;
  accent: string;
  pages: string[];
  features: string[];
  extras: string[];
  quote: Quote;
  shareUrl: string;
}

/** Spec 5.9 builder WhatsApp template. Truncates lists if the message is too long. */
export function buildDesignWhatsappMessage(input: BuilderWhatsappInput): string {
  const onceOff = input.quote.overCap
    ? `Custom quote please (over ${formatZAR(ONCE_OFF_CAP)})`
    : formatZAR(input.quote.onceOff);

  const full = [
    'Hi Thanda! I designed my website on Brike Web.',
    '',
    `Business: ${input.businessName} (${input.industry}, ${input.location})`,
    `Style: ${input.presetName}, colours ${input.primary} / ${input.accent}`,
    `Pages (${input.pages.length}): ${input.pages.join(', ') || 'Home'}`,
    `Features: ${input.features.length ? input.features.join(', ') : 'None'}`,
    `Extras: ${input.extras.length ? input.extras.join(', ') : 'None'}`,
    '',
    `Recommended package: ${input.quote.package.name} (${formatZAR(input.quote.package.price)})`,
    `Once-off total: ${onceOff}`,
    `Monthly: ${formatZAR(input.quote.monthly)}/month`,
    `Domain: ${formatZAR(input.quote.yearly)}/year`,
    '',
    `See my design: ${input.shareUrl}`,
    '',
    "I understand there's no deposit and I pay when I approve. Can we start?",
  ].join('\n');

  if (full.length <= 1800) return full;

  return [
    'Hi Thanda! I designed my website on Brike Web.',
    '',
    `Business: ${input.businessName} (${input.industry}, ${input.location})`,
    `Recommended package: ${input.quote.package.name}`,
    `Once-off total: ${onceOff}`,
    `Monthly: ${formatZAR(input.quote.monthly)}/month`,
    '',
    `See my design: ${input.shareUrl}`,
    '',
    "I understand there's no deposit and I pay when I approve. Can we start?",
  ].join('\n');
}

export function buildDesignWhatsappLink(input: BuilderWhatsappInput): string {
  return siteWhatsappLink(buildDesignWhatsappMessage(input));
}
