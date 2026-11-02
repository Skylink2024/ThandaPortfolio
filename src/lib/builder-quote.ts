import { ONCE_OFF_CAP, type Extra } from '@data/pricing';
import {
  buildQuote,
  EMPTY_SELECTION,
  type Quote,
  type QuoteLine,
  type Selection,
} from '@/lib/pricing';
import type { FeatureId, PageId } from '@data/builder';
import type { PackageId } from '@data/pricing';

/** Once-off feature add-ons not covered by package upgrades. */
export const FEATURE_ADD_ONS: Partial<
  Record<FeatureId, { id: string; label: string; amount: number }>
> = {
  // TODO(Thanda): confirm booking and multilingual prices
  booking: { id: 'feature:booking', label: 'Online booking', amount: 1500 },
  multilingual: {
    id: 'feature:multilingual',
    label: 'Multilingual (EN/AF/XH)',
    amount: 1500,
  },
};

export function selectionFromBuilder(input: {
  pages: PageId[];
  features: FeatureId[];
  extras: Extra['id'][];
  forcedPackage?: PackageId;
}): Selection {
  const { pages, features, extras, forcedPackage } = input;
  return {
    ...EMPTY_SELECTION,
    pages: Math.max(1, pages.length),
    needsGallery: pages.includes('gallery'),
    needsMaps: features.includes('maps'),
    needsShop: pages.includes('shop') || features.includes('shop'),
    needsPayments: features.includes('payments'),
    needsEditor: pages.includes('blog') || features.includes('blog'),
    needsSeoSetup: extras.includes('seoOnce') || extras.includes('googleStarter'),
    needsGbpSetup: extras.includes('gbpSetup') || extras.includes('googleStarter'),
    extras,
    forcedPackage,
  };
}

export function buildBuilderQuote(input: {
  pages: PageId[];
  features: FeatureId[];
  extras: Extra['id'][];
  forcedPackage?: PackageId;
}): Quote {
  const base = buildQuote(selectionFromBuilder(input));
  const lines: QuoteLine[] = [...base.lines];
  let onceOff = base.onceOff;

  for (const feature of input.features) {
    const addOn = FEATURE_ADD_ONS[feature];
    if (!addOn) continue;
    if (lines.some((l) => l.id === addOn.id)) continue;
    lines.push({
      id: addOn.id,
      label: addOn.label,
      amount: addOn.amount,
      billing: 'once',
    });
    onceOff += addOn.amount;
  }

  return {
    ...base,
    lines,
    onceOff,
    overCap: onceOff > ONCE_OFF_CAP,
  };
}
