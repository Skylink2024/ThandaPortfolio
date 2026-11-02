import {
  extras as extrasData,
  ONCE_OFF_CAP,
  packages,
  type Billing,
  type Extra,
  type Package,
  type PackageId,
} from '@data/pricing';
import { formatZAR } from '@/lib/format';

/**
 * Pricing calculation helpers (pure functions, no side effects).
 * All prices come from `data/pricing.ts`; nothing is hard-coded here.
 */

export interface Selection {
  /** Total number of pages chosen. */
  pages: number;
  needsSeoSetup: boolean;
  needsGbpSetup: boolean;
  needsEditor: boolean;
  needsShop: boolean;
  needsPayments: boolean;
  needsGallery: boolean;
  needsMaps: boolean;
  /** Explicitly chosen extras. */
  extras: Extra['id'][];
  /** User picked a package manually. */
  forcedPackage?: PackageId;
}

export interface QuoteLine {
  id: string;
  label: string;
  amount: number;
  billing: Billing;
  note?: string;
}

export interface Quote {
  package: Package;
  lines: QuoteLine[];
  onceOff: number;
  monthly: number;
  yearly: number;
  /** onceOff > ONCE_OFF_CAP. When true, UIs must never show the once-off number. */
  overCap: boolean;
  /** Explanations, e.g. "Upgraded to Online Shop because you added payments". */
  autoAdded: string[];
}

export const EMPTY_SELECTION: Selection = {
  pages: 1,
  needsSeoSetup: false,
  needsGbpSetup: false,
  needsEditor: false,
  needsShop: false,
  needsPayments: false,
  needsGallery: false,
  needsMaps: false,
  extras: [],
};

export function getPackage(id: PackageId): Package {
  const pkg = packages.find((p) => p.id === id);
  if (!pkg) throw new Error(`Unknown package: ${id}`);
  return pkg;
}

export function getExtra(id: Extra['id']): Extra {
  const extra = extrasData.find((e) => e.id === id);
  if (!extra) throw new Error(`Unknown extra: ${id}`);
  return extra;
}

/** True when the extra is already part of the given package. */
export function isIncludedIn(extraId: Extra['id'], packageId: PackageId): boolean {
  return getExtra(extraId).includedInPackages?.includes(packageId) ?? false;
}

/** Exclusivity is symmetric even when the data only declares it on one side. */
export function exclusiveWithOf(id: Extra['id']): Extra['id'][] {
  return extrasData
    .filter((e) => e.id !== id && (e.exclusiveWith?.includes(id) || getExtra(id).exclusiveWith?.includes(e.id)))
    .map((e) => e.id);
}

/**
 * Remove duplicates and enforce `exclusiveWith`: when two exclusive extras are
 * both present, the one chosen last wins.
 */
export function normalizeExtras(ids: readonly Extra['id'][]): Extra['id'][] {
  let result: Extra['id'][] = [];
  for (const id of ids) {
    const exclusive = exclusiveWithOf(id);
    result = result.filter((existing) => existing !== id && !exclusive.includes(existing));
    result.push(id);
  }
  return result;
}

/** Toggle an extra on/off; turning one on deselects anything exclusive with it. */
export function toggleExtra(current: readonly Extra['id'][], id: Extra['id']): Extra['id'][] {
  if (current.includes(id)) return current.filter((x) => x !== id);
  return normalizeExtras([...current, id]);
}

/** Extra pages beyond what the package includes. */
export function extraPagesFor(pkg: Package, pages: number): number {
  return Math.max(0, Math.floor(pages) - pkg.capability.maxPages);
}

interface GoogleNeeds {
  seo: boolean;
  gbp: boolean;
}

/** SEO / Google Business needs from flags plus any explicitly chosen extras. */
function googleNeeds(sel: Selection, extras: readonly Extra['id'][]): GoogleNeeds {
  const bundle = extras.includes('googleStarter');
  return {
    seo: sel.needsSeoSetup || extras.includes('seoOnce') || bundle,
    gbp: sel.needsGbpSetup || extras.includes('gbpSetup') || bundle,
  };
}

/** Cost of SEO / GBP the package does not already cover (uses the bundle when cheaper). */
function missingGoogleCost(pkg: Package, needs: GoogleNeeds): number {
  const missingSeo = needs.seo && !pkg.capability.seoSetup;
  const missingGbp = needs.gbp && !pkg.capability.gbpSetup;
  const seo = getExtra('seoOnce').price;
  const gbp = getExtra('gbpSetup').price;
  if (missingSeo && missingGbp) return Math.min(getExtra('googleStarter').price, seo + gbp);
  if (missingSeo) return seo;
  if (missingGbp) return gbp;
  return 0;
}

/** Effective once-off cost of a candidate package for the given selection. */
function effectiveCost(pkg: Package, sel: Selection, needs: GoogleNeeds): number {
  return (
    pkg.price +
    extraPagesFor(pkg, sel.pages) * getExtra('extraPage').price +
    missingGoogleCost(pkg, needs)
  );
}

const CANDIDATE_ORDER: PackageId[] = ['starter', 'business', 'google', 'editor', 'shop'];

function coversHardNeeds(pkg: Package, sel: Selection): boolean {
  if ((sel.needsShop || sel.needsPayments) && !(pkg.capability.shop && pkg.capability.payments)) {
    return false;
  }
  if (sel.needsEditor && !pkg.capability.cmsEditor) return false;
  return true;
}

function candidatesFor(sel: Selection): Package[] {
  return CANDIDATE_ORDER.map(getPackage).filter((pkg) => {
    if (!coversHardNeeds(pkg, sel)) return false;
    if ((sel.needsGallery || sel.needsMaps) && pkg.id === 'starter') return false;
    return true;
  });
}

function hardNeedReason(sel: Selection): string {
  if (sel.needsPayments) return 'payments';
  if (sel.needsShop) return 'an online shop';
  if (sel.needsEditor) return 'the editor';
  return 'your selection';
}

/**
 * Recommend the cheapest package that covers the selection.
 * Ties go to the higher package (more value).
 */
export function recommendPackage(sel: Selection): Package {
  const needs = googleNeeds(sel, normalizeExtras(sel.extras));
  const candidates = candidatesFor(sel);

  let best: Package | undefined;
  let bestCost = Infinity;
  for (const pkg of candidates) {
    const cost = effectiveCost(pkg, sel, needs);
    if (cost <= bestCost) {
      best = pkg;
      bestCost = cost;
    }
  }
  // Candidates can never be empty (the shop package covers every hard need).
  return best ?? getPackage('shop');
}

function onceNote(pkg: Package, extra: Extra): QuoteLine {
  return {
    id: extra.id,
    label: extra.name,
    amount: 0,
    billing: extra.billing,
    note: `Included in ${pkg.name}`,
  };
}

/** Build the full quote for a selection. */
export function buildQuote(sel: Selection): Quote {
  const autoAdded: string[] = [];
  const chosenExtras = normalizeExtras(sel.extras);

  // 1. Resolve the package.
  let pkg: Package;
  if (sel.forcedPackage) {
    const forced = getPackage(sel.forcedPackage);
    if (coversHardNeeds(forced, sel)) {
      pkg = forced;
    } else {
      pkg = recommendPackage(sel);
      autoAdded.push(`Upgraded to ${pkg.name} because you added ${hardNeedReason(sel)}.`);
    }
  } else {
    pkg = recommendPackage(sel);
  }

  const lines: QuoteLine[] = [];

  // 2. Package line.
  lines.push({
    id: `package:${pkg.id}`,
    label: pkg.name,
    amount: pkg.price,
    billing: 'once',
  });

  // 3. Extra pages.
  const extraPages = extraPagesFor(pkg, sel.pages);
  if (extraPages > 0) {
    const unit = getExtra('extraPage').price;
    lines.push({
      id: 'extraPage',
      label: `Extra pages (${extraPages} × ${formatZAR(unit)})`,
      amount: extraPages * unit,
      billing: 'once',
    });
  }

  // 4. Required SEO / Google Business lines.
  const needs = googleNeeds(sel, chosenExtras);
  const seoExtra = getExtra('seoOnce');
  const gbpExtra = getExtra('gbpSetup');
  const bundleExtra = getExtra('googleStarter');
  const bundleChosen = chosenExtras.includes('googleStarter');
  const fromFlags = (flag: boolean, id: Extra['id']) => flag && !chosenExtras.includes(id);

  const missingSeo = needs.seo && !isIncludedIn('seoOnce', pkg.id);
  const missingGbp = needs.gbp && !isIncludedIn('gbpSetup', pkg.id);

  if (needs.seo && needs.gbp && isIncludedIn('googleStarter', pkg.id) && bundleChosen) {
    lines.push(onceNote(pkg, bundleExtra));
  } else {
    if (needs.seo && !missingSeo) lines.push(onceNote(pkg, seoExtra));
    if (needs.gbp && !missingGbp) lines.push(onceNote(pkg, gbpExtra));
  }

  if (missingSeo && missingGbp) {
    const separate = seoExtra.price + gbpExtra.price;
    if (bundleExtra.price < separate) {
      lines.push({
        id: bundleExtra.id,
        label: bundleExtra.name,
        amount: bundleExtra.price,
        billing: 'once',
        note: `Saves ${formatZAR(separate - bundleExtra.price)}`,
      });
      if (!bundleChosen) {
        autoAdded.push(
          `Using the ${bundleExtra.name} (${formatZAR(bundleExtra.price)}) because it's cheaper than SEO and Google Business Profile separately.`,
        );
      }
    } else {
      lines.push(
        { id: seoExtra.id, label: seoExtra.name, amount: seoExtra.price, billing: 'once' },
        { id: gbpExtra.id, label: gbpExtra.name, amount: gbpExtra.price, billing: 'once' },
      );
    }
  } else {
    if (missingSeo) {
      lines.push({ id: seoExtra.id, label: seoExtra.name, amount: seoExtra.price, billing: 'once' });
    }
    if (missingGbp) {
      lines.push({ id: gbpExtra.id, label: gbpExtra.name, amount: gbpExtra.price, billing: 'once' });
    }
  }
  if (fromFlags(missingSeo, 'seoOnce') && !(missingSeo && missingGbp)) {
    autoAdded.push(`Added ${seoExtra.name} because your site needs SEO setup.`);
  }
  if (fromFlags(missingGbp, 'gbpSetup') && !(missingSeo && missingGbp)) {
    autoAdded.push(`Added ${gbpExtra.name} because you want to be found on Google.`);
  }

  // 5. Other chosen extras (Google items are handled above).
  const handled = new Set<Extra['id']>(['seoOnce', 'gbpSetup', 'googleStarter', 'extraPage']);
  for (const id of chosenExtras) {
    if (handled.has(id)) continue;
    const extra = getExtra(id);
    if (extra.includedInPackages?.includes(pkg.id)) {
      lines.push(onceNote(pkg, extra));
      continue;
    }
    lines.push({
      id: extra.id,
      label: extra.name,
      amount: extra.price,
      billing: extra.billing,
      note: extra.billing === 'hour' ? `${formatZAR(extra.price)}/hour, only if needed` : undefined,
    });
  }

  // 6. Totals. Hourly lines (extraChanges) are info only and never summed.
  const sum = (billing: Billing) =>
    lines.filter((l) => l.billing === billing).reduce((total, l) => total + l.amount, 0);
  const onceOff = sum('once');

  return {
    package: pkg,
    lines,
    onceOff,
    monthly: sum('month'),
    yearly: sum('year'),
    overCap: onceOff > ONCE_OFF_CAP,
    autoAdded,
  };
}

const BILLING_SUFFIX: Record<Billing, string> = {
  once: ' once-off',
  month: '/month',
  year: '/year',
  hour: '/hour',
};

/** e.g. "R199/month" or "R1,200 once-off". */
export function formatPrice(amount: number, billing: Billing): string {
  return `${formatZAR(amount)}${BILLING_SUFFIX[billing]}`;
}
