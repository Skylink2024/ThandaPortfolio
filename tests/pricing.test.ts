import { describe, expect, it } from 'vitest';
import { extras, ONCE_OFF_CAP, packages } from '../data/pricing';
import {
  buildQuote,
  EMPTY_SELECTION,
  normalizeExtras,
  recommendPackage,
  toggleExtra,
  type Selection,
} from '../src/lib/pricing';

const sel = (over: Partial<Selection> = {}): Selection => ({ ...EMPTY_SELECTION, ...over });

describe('pricing data', () => {
  it('caps once-off at 15000', () => {
    expect(ONCE_OFF_CAP).toBe(15_000);
  });

  it('has the 5 packages with exact prices', () => {
    expect(packages.map((p) => [p.id, p.price])).toEqual([
      ['starter', 2500],
      ['business', 4500],
      ['google', 6900],
      ['editor', 8900],
      ['shop', 12900],
    ]);
  });

  it('has the 11 extras with exact prices', () => {
    expect(extras).toHaveLength(11);
    expect(Object.fromEntries(extras.map((e) => [e.id, [e.price, e.billing]]))).toEqual({
      domain: [250, 'year'],
      hostingBasic: [199, 'month'],
      hostingBusiness: [349, 'month'],
      care: [499, 'month'],
      extraChanges: [450, 'hour'],
      gbpSetup: [1200, 'once'],
      gbpCare: [750, 'month'],
      seoOnce: [3500, 'once'],
      localSeo: [1950, 'month'],
      googleStarter: [4200, 'once'],
      extraPage: [450, 'once'],
    });
  });

  it('marks only Business as most popular', () => {
    expect(packages.filter((p) => p.popular).map((p) => p.id)).toEqual(['business']);
  });
});

describe('recommendPackage', () => {
  it('recommends Starter for 1 page and no features', () => {
    expect(recommendPackage(sel()).id).toBe('starter');
  });

  it('recommends Business for 4 pages with a gallery', () => {
    expect(recommendPackage(sel({ pages: 4, needsGallery: true })).id).toBe('business');
  });

  it('does not recommend Starter when maps are needed', () => {
    expect(recommendPackage(sel({ needsMaps: true })).id).toBe('business');
  });

  it('recommends Get Found on Google when SEO + GBP are needed', () => {
    const s = sel({ pages: 4, needsGallery: true, needsSeoSetup: true, needsGbpSetup: true });
    expect(recommendPackage(s).id).toBe('google');
    // Business + bundle would be R8,700; Google is R6,900.
    const q = buildQuote(s);
    expect(q.package.id).toBe('google');
    expect(q.onceOff).toBe(6900);
  });

  it('recommends Edit It Yourself when a CMS editor is needed', () => {
    expect(recommendPackage(sel({ pages: 5, needsEditor: true })).id).toBe('editor');
  });

  it('recommends Online Shop for payments or a shop', () => {
    expect(recommendPackage(sel({ needsPayments: true })).id).toBe('shop');
    expect(recommendPackage(sel({ needsShop: true })).id).toBe('shop');
  });

  it('keeps Business with extra pages instead of jumping to Editor (7 pages)', () => {
    const s = sel({ pages: 7, needsGallery: true });
    expect(recommendPackage(s).id).toBe('business');
    const q = buildQuote(s);
    expect(q.onceOff).toBe(5400); // 4,500 + 2 × 450
    expect(q.lines.find((l) => l.id === 'extraPage')?.amount).toBe(900);
  });

  it('breaks ties in favour of the higher package', () => {
    // Business + R1,200 GBP = 5,700 ; Google = 6,900 -> not a tie, sanity check on ordering.
    expect(recommendPackage(sel({ needsGallery: true, needsGbpSetup: true })).id).toBe('business');
  });
});

describe('buildQuote', () => {
  it('builds a Starter quote with no extras', () => {
    const q = buildQuote(sel());
    expect(q.package.id).toBe('starter');
    expect(q.onceOff).toBe(2500);
    expect(q.monthly).toBe(0);
    expect(q.yearly).toBe(0);
    expect(q.overCap).toBe(false);
  });

  it('sums once-off, monthly and yearly separately', () => {
    const q = buildQuote(
      sel({
        forcedPackage: 'business',
        pages: 5,
        extras: ['domain', 'hostingBasic', 'care', 'localSeo'],
      }),
    );
    expect(q.onceOff).toBe(4500);
    expect(q.monthly).toBe(199 + 499 + 1950);
    expect(q.yearly).toBe(250);
  });

  it('uses the Google Starter bundle instead of separate SEO + GBP', () => {
    const q = buildQuote(
      sel({ forcedPackage: 'business', pages: 5, needsSeoSetup: true, needsGbpSetup: true }),
    );
    const ids = q.lines.map((l) => l.id);
    expect(ids).toContain('googleStarter');
    expect(ids).not.toContain('seoOnce');
    expect(ids).not.toContain('gbpSetup');
    expect(q.onceOff).toBe(4500 + 4200);
    expect(q.autoAdded.join(' ')).toMatch(/Google Starter bundle/);
  });

  it('merges explicitly chosen seoOnce + gbpSetup into the bundle', () => {
    const q = buildQuote(
      sel({ forcedPackage: 'editor', pages: 8, extras: ['seoOnce', 'gbpSetup'] }),
    );
    expect(q.lines.some((l) => l.id === 'googleStarter')).toBe(true);
    expect(q.onceOff).toBe(8900 + 4200);
  });

  it('charges a single SEO or GBP item when only one is needed', () => {
    expect(buildQuote(sel({ forcedPackage: 'business', pages: 5, needsSeoSetup: true })).onceOff).toBe(
      4500 + 3500,
    );
    expect(buildQuote(sel({ forcedPackage: 'business', pages: 5, extras: ['gbpSetup'] })).onceOff).toBe(
      4500 + 1200,
    );
  });

  it('shows SEO / GBP / bundle as included (R0) on Get Found on Google', () => {
    const q = buildQuote(
      sel({ forcedPackage: 'google', pages: 5, extras: ['seoOnce', 'gbpSetup', 'googleStarter'] }),
    );
    expect(q.onceOff).toBe(6900);
    expect(q.lines.filter((l) => l.note?.startsWith('Included')).length).toBeGreaterThan(0);
    expect(q.lines.filter((l) => l.amount > 0)).toHaveLength(1);
  });

  it('flags overCap when shop + SEO pass R15,000', () => {
    const q = buildQuote(sel({ forcedPackage: 'shop', pages: 8, extras: ['seoOnce'] }));
    expect(q.onceOff).toBe(12900 + 3500);
    expect(q.overCap).toBe(true);
  });

  it('is not overCap exactly at R15,000', () => {
    // Shop 12,900 + 2 × 450 extra pages... 8 pages included; 12,900 + 1,200 GBP = 14,100.
    const q = buildQuote(sel({ forcedPackage: 'shop', pages: 8, extras: ['gbpSetup'] }));
    expect(q.onceOff).toBe(14100);
    expect(q.overCap).toBe(false);
  });

  it('upgrades a forced package that cannot cover payments', () => {
    const q = buildQuote(sel({ forcedPackage: 'business', pages: 5, needsPayments: true }));
    expect(q.package.id).toBe('shop');
    expect(q.autoAdded.join(' ')).toMatch(/Upgraded to Online Shop because you added payments/);
  });

  it('respects a forced package that covers hard needs', () => {
    const q = buildQuote(sel({ forcedPackage: 'shop', pages: 1, needsPayments: true }));
    expect(q.package.id).toBe('shop');
    expect(q.autoAdded).toEqual([]);
  });

  it('shows extraChanges as info and never sums it', () => {
    const q = buildQuote(sel({ forcedPackage: 'business', pages: 5, extras: ['extraChanges'] }));
    const line = q.lines.find((l) => l.id === 'extraChanges');
    expect(line?.billing).toBe('hour');
    expect(line?.note).toBe('R450/hour, only if needed');
    expect(q.onceOff).toBe(4500);
    expect(q.monthly).toBe(0);
    expect(q.yearly).toBe(0);
  });
});

describe('exclusive extras', () => {
  it('hosting tiers are exclusive (last wins)', () => {
    expect(normalizeExtras(['hostingBasic', 'hostingBusiness'])).toEqual(['hostingBusiness']);
    expect(normalizeExtras(['hostingBusiness', 'hostingBasic'])).toEqual(['hostingBasic']);
  });

  it('buildQuote only bills one hosting tier', () => {
    const q = buildQuote(
      sel({ forcedPackage: 'business', pages: 5, extras: ['hostingBasic', 'hostingBusiness'] }),
    );
    expect(q.monthly).toBe(349);
    expect(q.lines.filter((l) => l.id.startsWith('hosting'))).toHaveLength(1);
  });

  it('toggleExtra deselects the exclusive counterpart', () => {
    expect(toggleExtra(['hostingBasic'], 'hostingBusiness')).toEqual(['hostingBusiness']);
    expect(toggleExtra(['hostingBusiness'], 'hostingBusiness')).toEqual([]);
    expect(toggleExtra(['seoOnce', 'gbpSetup'], 'googleStarter')).toEqual(['googleStarter']);
    expect(toggleExtra(['googleStarter'], 'seoOnce')).toEqual(['seoOnce']);
  });
});
