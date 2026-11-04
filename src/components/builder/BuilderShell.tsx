'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  featuresCatalog,
  industries,
  pagesCatalog,
  stylePresets,
  type FeatureId,
  type FontPairId,
  type PageId,
  type PresetId,
} from '@data/builder';
import { extras as extrasData, type Extra, type PackageId } from '@data/pricing';
import type { Industry } from '@data/projects';
import { site } from '@data/site';
import { BuilderReveal } from '@/components/builder/Reveal';
import { PreviewPane } from '@/components/builder/PreviewPane';
import { PriceBar } from '@/components/builder/PriceBar';
import { ShareActions } from '@/components/builder/ShareActions';
import { STEP_LABELS, StepNav } from '@/components/builder/StepNav';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';
import { track } from '@/lib/analytics';
import { buildBuilderQuote, FEATURE_ADD_ONS } from '@/lib/builder-quote';
import { formatZAR } from '@/lib/format';
import { decodeDesign, encodeDesign, type SharedDesign } from '@/lib/share';
import { useBuilderStore, type BuilderStep } from '@/store/builder';

const FONT_PAIRS: { id: FontPairId; label: string; sample: string }[] = [
  { id: 'modern', label: 'Plus Jakarta / Inter', sample: 'Aa' },
  { id: 'luxury', label: 'Playfair / Lato', sample: 'Aa' },
  { id: 'bold', label: 'Anton / Archivo', sample: 'Aa' },
  { id: 'minimal', label: 'DM Sans', sample: 'Aa' },
  { id: 'playful', label: 'Fredoka / Nunito', sample: 'Aa' },
  { id: 'corporate', label: 'Montserrat / Source Sans', sample: 'Aa' },
  { id: 'space-grotesk', label: 'Space Grotesk / Inter', sample: 'Aa' },
  { id: 'poppins', label: 'Poppins / Open Sans', sample: 'Aa' },
];

const PAGE_BLURBS: Record<PageId, string> = {
  home: 'Your main landing page',
  about: 'Your story and team',
  services: 'What you offer',
  gallery: 'Photos of your work',
  menu: 'Prices or a food menu',
  bookings: 'Let people book online',
  shop: 'Sell products online',
  blog: 'Tips and updates',
  contact: 'Form, map and details',
};

function isPackageId(v: string | null): v is PackageId {
  return (
    v === 'starter' ||
    v === 'business' ||
    v === 'google' ||
    v === 'editor' ||
    v === 'shop'
  );
}

function isIndustry(v: string | null): v is Industry {
  return industries.some((i) => i.id === v);
}

function impactChip(kind: 'included' | 'upgrade' | 'addon', label: string) {
  const tones = {
    included: 'bg-success/15 text-success',
    upgrade: 'bg-warning/15 text-warning',
    addon: 'bg-orange text-navy',
  };
  return (
    <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold', tones[kind])}>
      {label}
    </span>
  );
}

function pageImpact(id: PageId) {
  if (id === 'home') return impactChip('included', 'Included');
  if (id === 'gallery') return impactChip('upgrade', 'Needs Business+');
  if (id === 'shop') return impactChip('upgrade', 'Upgrades to Online Shop');
  if (id === 'blog') return impactChip('upgrade', 'Needs Edit It Yourself');
  if (id === 'bookings') return impactChip('addon', '+R1,500');
  return impactChip('addon', '+1 page');
}

function featureImpact(id: FeatureId) {
  if (id === 'whatsapp' || id === 'contactForm') return impactChip('included', 'Included');
  if (id === 'maps') return impactChip('upgrade', 'Needs Business+');
  if (id === 'payments' || id === 'shop') return impactChip('upgrade', 'Upgrades to Online Shop');
  if (id === 'blog') return impactChip('upgrade', 'Needs Edit It Yourself');
  const addOn = FEATURE_ADD_ONS[id];
  if (addOn) return impactChip('addon', `+${formatZAR(addOn.amount)}`);
  return impactChip('addon', 'Add-on');
}

export function BuilderShell() {
  const searchParams = useSearchParams();
  const hydratedRef = useRef(false);
  const confettiRef = useRef(false);
  const [device, setDevice] = useState<'desktop' | 'phone'>('desktop');
  const [toast, setToast] = useState<string | null>(null);
  const [initialShare] = useState(() => {
    const d = searchParams.get('d');
    return d ? { decoded: decodeDesign(d) } : null;
  });
  const [shareBroken, setShareBroken] = useState(() => !!initialShare && !initialShare.decoded);
  const [sharedBanner, setSharedBanner] = useState(() => !!initialShare?.decoded);
  const fileRef = useRef<HTMLInputElement>(null);

  const state = useBuilderStore();
  const {
    step,
    business,
    style,
    pages,
    features,
    extras,
    forcedPackage,
    setStep,
    updateBusiness,
    applyPreset,
    setColors,
    setFontPair,
    setLogoUrl,
    togglePage,
    toggleFeature,
    toggleExtra,
    setForcedPackage,
    hydrateFromShare,
    reset,
  } = state;

  const quote = useMemo(
    () => buildBuilderQuote({ pages, features, extras, forcedPackage }),
    [pages, features, extras, forcedPackage],
  );

  const prevPackage = useRef(quote.package.id);
  useEffect(() => {
    if (prevPackage.current !== quote.package.id) {
      if (prevPackage.current) {
        setToast(`Upgraded to ${quote.package.name} because of your selection.`);
        window.setTimeout(() => setToast(null), 4500);
      }
      prevPackage.current = quote.package.id;
    }
  }, [quote.package.id, quote.package.name]);

  useEffect(() => {
    track('builder_step', { step });
  }, [step]);

  // URL hydration once
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    if (initialShare) {
      if (initialShare.decoded) hydrateFromShare(initialShare.decoded);
      return;
    }
    const pkg = searchParams.get('package');
    if (isPackageId(pkg)) setForcedPackage(pkg);
    const industry = searchParams.get('industry');
    if (isIndustry(industry)) updateBusiness({ industry });
    const extrasParam = searchParams.get('extras');
    if (extrasParam) {
      extrasParam.split(',').forEach((id) => {
        if (extrasData.some((e) => e.id === id) && !useBuilderStore.getState().extras.includes(id as Extra['id'])) {
          toggleExtra(id as Extra['id']);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const design: SharedDesign = useMemo(
    () => ({
      v: 1,
      b: business,
      s: {
        presetId: style.presetId,
        primary: style.primary,
        accent: style.accent,
        fontPairId: style.fontPairId,
      },
      p: pages,
      f: features,
      e: extras,
      k: forcedPackage,
    }),
    [business, style, pages, features, extras, forcedPackage],
  );

  const shareCode = useMemo(() => encodeDesign(design), [design]);
  const shareUrl = `${site.url}/build?d=${shareCode}`;

  const industryConfig =
    industries.find((i) => i.id === business.industry) ?? industries[0]!;
  const preset = stylePresets.find((p) => p.id === style.presetId) ?? stylePresets[0]!;

  useEffect(() => {
    if (step !== 5 || confettiRef.current) return;
    confettiRef.current = true;
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.35 },
      colors: [style.primary, style.accent, '#FFFFFF'],
    });
    track('builder_complete', {
      package: quote.package.id,
      onceOff: quote.overCap ? null : quote.onceOff,
    });
  }, [step, style.primary, style.accent, quote.package.id, quote.onceOff, quote.overCap]);

  function next() {
    if (step < 5) setStep((step + 1) as BuilderStep);
  }
  function back() {
    if (step > 0) setStep((step - 1) as BuilderStep);
  }

  function onLogo(file?: File | null) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setToast('Logo must be under 2 MB.');
      return;
    }
    if (style.logoUrl) URL.revokeObjectURL(style.logoUrl);
    setLogoUrl(URL.createObjectURL(file));
  }

  const domainHint =
    (business.name || 'yourbusiness')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 24) || 'yourbusiness';

  const bothGoogle =
    extras.includes('seoOnce') && extras.includes('gbpSetup') && !extras.includes('googleStarter');

  const stepBody = (
    <AnimatePresence mode="wait">
      <BuilderReveal stepKey={step}>
        {step === 0 ? (
          <div className="space-y-5">
            <h2 className="text-h3 text-gray-900">Let&apos;s start with your business.</h2>
            <label className="block">
              <span className="text-micro text-gray-500">Business name *</span>
              <input
                value={business.name}
                maxLength={40}
                onChange={(e) => updateBusiness({ name: e.target.value })}
                placeholder="e.g. Ocean Fade Barbers"
                className="border-border bg-bg mt-2 h-12 w-full rounded-[var(--radius-md)] border px-4 outline-none focus:border-navy"
              />
            </label>
            <label className="block">
              <span className="text-micro text-gray-500">Industry</span>
              <select
                value={business.industry}
                onChange={(e) => updateBusiness({ industry: e.target.value as Industry })}
                className="border-border bg-bg mt-2 h-12 w-full rounded-[var(--radius-md)] border px-4 outline-none focus:border-navy"
              >
                {industries.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-micro text-gray-500">Location</span>
              <input
                value={business.location}
                onChange={(e) => updateBusiness({ location: e.target.value })}
                className="border-border bg-bg mt-2 h-12 w-full rounded-[var(--radius-md)] border px-4 outline-none focus:border-navy"
              />
            </label>
            <label className="block">
              <span className="text-micro text-gray-500">Tagline (optional)</span>
              <input
                value={business.tagline}
                maxLength={70}
                onChange={(e) => updateBusiness({ tagline: e.target.value })}
                className="border-border bg-bg mt-2 h-12 w-full rounded-[var(--radius-md)] border px-4 outline-none focus:border-navy"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {industryConfig.suggestedTaglines.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => updateBusiness({ tagline: t })}
                    className="border-border rounded-full border px-3 py-1 text-xs font-medium text-gray-700 hover:border-navy"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </label>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-6">
            <h2 className="text-h3 text-gray-900">Pick a look you love.</h2>
            <div className="grid grid-cols-2 gap-3">
              {stylePresets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p.id as PresetId)}
                  className={cn(
                    'rounded-[var(--radius-md)] border p-3 text-left transition',
                    style.presetId === p.id ? 'border-navy ring-2 ring-navy/30' : 'border-border',
                  )}
                >
                  <div
                    className="mb-2 h-14 rounded"
                    style={{
                      background: `linear-gradient(135deg, ${p.primary}, ${p.accent})`,
                      borderRadius: p.radius,
                    }}
                  />
                  <p className="font-semibold text-gray-900">{p.name}</p>
                  <p className="mt-1 text-xs text-gray-500">{p.vibe}</p>
                </button>
              ))}
            </div>
            <div>
              <p className="text-micro text-gray-500">Colours</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  Primary
                  <input
                    type="color"
                    value={style.primary}
                    onChange={(e) => setColors(e.target.value, style.accent)}
                    className="h-10 w-12 cursor-pointer rounded border border-border bg-transparent"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm">
                  Accent
                  <input
                    type="color"
                    value={style.accent}
                    onChange={(e) => setColors(style.primary, e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded border border-border bg-transparent"
                  />
                </label>
                {preset ? (
                  <div className="flex gap-1">
                    {[preset.primary, preset.accent, '#0B1F3A', '#1E6FFF', '#111111', '#FFFFFF', '#FF3B30', '#B08D57'].map(
                      (c) => (
                        <button
                          key={c}
                          type="button"
                          aria-label={`Use ${c}`}
                          onClick={() => setColors(c, style.accent)}
                          className="size-7 rounded-full border border-border"
                          style={{ background: c }}
                        />
                      ),
                    )}
                  </div>
                ) : null}
              </div>
            </div>
            <div>
              <p className="text-micro text-gray-500">Fonts</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {FONT_PAIRS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFontPair(f.id)}
                    className={cn(
                      'rounded-[var(--radius-md)] border px-3 py-2 text-left',
                      style.fontPairId === f.id ? 'border-navy' : 'border-border',
                    )}
                  >
                    <span className="text-xl font-bold">{f.sample}</span>
                    <span className="mt-1 block text-xs text-gray-500">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-micro text-gray-500">Logo (optional)</p>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="border-border mt-2 flex w-full flex-col items-center justify-center rounded-[var(--radius-md)] border border-dashed px-4 py-8 text-center text-sm text-gray-600 hover:border-navy"
              >
                {style.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={style.logoUrl} alt="Uploaded logo" className="mb-2 h-12 object-contain" />
                ) : null}
                Drop your logo here or click to upload. PNG, JPG or SVG, max 2 MB. It stays on your
                device.
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                className="hidden"
                onChange={(e) => onLogo(e.target.files?.[0])}
              />
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-5">
            <h2 className="text-h3 text-gray-900">Which pages do you need?</h2>
            <p className="text-sm text-gray-600">
              {pages.length} pages. {quote.package.name} covers up to {quote.package.capability.maxPages}.
            </p>
            <div className="space-y-2">
              {pagesCatalog.map((p) => {
                const on = pages.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={p.alwaysOn}
                    onClick={() => togglePage(p.id)}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 rounded-[var(--radius-md)] border px-4 py-3 text-left',
                      on ? 'border-navy bg-bg ring-1 ring-navy' : 'border-border',
                      p.alwaysOn && 'opacity-80',
                    )}
                  >
                    <span>
                      <span className="font-semibold text-gray-900">{p.label}</span>
                      <span className="mt-0.5 block text-xs text-gray-500">{PAGE_BLURBS[p.id]}</span>
                    </span>
                    {pageImpact(p.id)}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-5">
            <h2 className="text-h3 text-gray-900">Add the features that bring in customers.</h2>
            <div className="space-y-2">
              {featuresCatalog.map((f) => {
                const on = features.includes(f.id);
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleFeature(f.id)}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 rounded-[var(--radius-md)] border px-4 py-3 text-left',
                      on ? 'border-navy bg-bg ring-1 ring-navy' : 'border-border',
                    )}
                  >
                    <span className="font-semibold text-gray-900">{f.label}</span>
                    {featureImpact(f.id)}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-5">
            <h2 className="text-h3 text-gray-900">Get found and stay looked after.</h2>
            {(
              [
                ['gbpSetup', 'Google Business Profile setup'],
                ['seoOnce', 'SEO once-off'],
                ['googleStarter', 'Google Starter bundle'],
                ['localSeo', 'Local SEO'],
                ['gbpCare', 'Google Business care'],
                ['domain', 'Domain'],
                ['care', 'Care plan'],
              ] as const
            ).map(([id, label]) => {
              const extra = extrasData.find((e) => e.id === id)!;
              const on = extras.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleExtra(id)}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 rounded-[var(--radius-md)] border px-4 py-3 text-left',
                    on ? 'border-navy bg-bg ring-1 ring-navy' : 'border-border',
                  )}
                >
                  <span>
                    <span className="font-semibold text-gray-900">{label}</span>
                    {id === 'domain' ? (
                      <span className="mt-0.5 block text-xs text-gray-500">
                        {domainHint}.co.za
                      </span>
                    ) : null}
                  </span>
                  <span className="text-sm font-mono text-gray-700">
                    {formatZAR(extra.price)}
                    {extra.billing === 'month'
                      ? '/mo'
                      : extra.billing === 'year'
                        ? '/yr'
                        : ''}
                  </span>
                </button>
              );
            })}

            <div>
              <p className="text-micro text-gray-500">Hosting</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(
                  [
                    [undefined, 'None'],
                    ['hostingBasic', 'Basic'],
                    ['hostingBusiness', 'Business'],
                  ] as const
                ).map(([id, label]) => {
                  const on = id
                    ? extras.includes(id)
                    : !extras.includes('hostingBasic') && !extras.includes('hostingBusiness');
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        const cur = useBuilderStore.getState().extras;
                        const cleared = cur.filter(
                          (e) => e !== 'hostingBasic' && e !== 'hostingBusiness',
                        );
                        useBuilderStore.setState({
                          extras: id ? [...cleared, id] : cleared,
                        });
                      }}
                      className={cn(
                        'rounded-[var(--radius-md)] border px-3 py-3 text-sm font-semibold',
                        on ? 'border-navy bg-bg ring-1 ring-navy' : 'border-border',
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {bothGoogle ? (
              <button
                type="button"
                onClick={() => {
                  toggleExtra('googleStarter');
                  // turn off separate if bundle on
                  const cur = useBuilderStore.getState().extras;
                  if (cur.includes('googleStarter')) {
                    useBuilderStore.setState({
                      extras: cur.filter((e) => e !== 'seoOnce' && e !== 'gbpSetup'),
                    });
                  }
                }}
                className="border-warning/40 bg-warning/10 w-full rounded-[var(--radius-md)] border px-4 py-3 text-left text-sm font-semibold text-gray-900"
              >
                Save R500 with the Google Starter bundle
              </button>
            ) : null}

            <p className="text-xs text-gray-500">
              Extra changes after launch are R450/hour, only if you need them.
            </p>
          </div>
        ) : null}

        {step === 5 ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-h2 text-gray-900">
                Here&apos;s your website{business.name ? `, ${business.name}` : ''}.
              </h2>
              <p className="text-lead mt-2 text-gray-600">You pay nothing until you love it.</p>
            </div>
            <Card className="space-y-3 p-5">
              <p className="text-sm text-gray-600">
                Recommended because you chose {pages.length} pages
                {pages.includes('gallery') ? ' and a gallery' : ''}.
              </p>
              <p className="font-semibold text-gray-900">
                {quote.package.name} · {formatZAR(quote.package.price)}
              </p>
              {quote.overCap ? (
                <p className="font-semibold text-gray-900">
                  Let&apos;s chat — I&apos;ll give you a custom quote.
                </p>
              ) : (
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>
                    Once-off total:{' '}
                    <span className="font-mono font-bold text-orange-ink">{formatZAR(quote.onceOff)}</span>
                  </li>
                  <li>
                    Monthly:{' '}
                    <span className="font-mono font-bold text-orange-ink">{formatZAR(quote.monthly)}/month</span>
                  </li>
                  <li>
                    Yearly:{' '}
                    <span className="font-mono font-bold text-orange-ink">{formatZAR(quote.yearly)}/year</span>
                  </li>
                </ul>
              )}
              <p className="text-sm text-gray-500">No deposit. Pay only after you approve.</p>
            </Card>
            <ShareActions
              quote={quote}
              shareUrl={shareUrl}
              designCode={shareCode}
              design={design}
              businessName={business.name || 'My business'}
              industry={industryConfig.label}
              location={business.location || 'Cape Town'}
              presetName={preset.name}
              primary={style.primary}
              accent={style.accent}
              pageLabels={pages.map((id) => pagesCatalog.find((p) => p.id === id)?.label ?? id)}
              featureLabels={features.map(
                (id) => featuresCatalog.find((f) => f.id === id)?.label ?? id,
              )}
              extraLabels={extras.map((id) => extrasData.find((e) => e.id === id)?.name ?? id)}
              onEdit={() => {
                confettiRef.current = false;
                setStep(0);
              }}
            />
          </div>
        ) : null}
      </BuilderReveal>
    </AnimatePresence>
  );

  return (
    <div className="relative mx-auto w-full max-w-7xl px-4 pb-28 pt-24 md:px-6 lg:pb-10 lg:pt-28">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-h1 text-gray-900">Design your website</h1>
        <p className="text-lead mt-3 text-gray-700">
          Build a preview of your site and see the price live. Free, no sign-up.
        </p>
        {sharedBanner ? (
          <p className="border-navy/15 bg-bg text-gray-900 mt-4 rounded-[var(--radius-md)] border px-4 py-2 text-sm font-medium">
            Shared design loaded — tweak anything or send it to me.
          </p>
        ) : null}
        {shareBroken ? (
          <p className="bg-danger/10 text-danger mt-4 rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium">
            This design link is broken. Start a new one.
          </p>
        ) : null}
      </div>

      <div className="lg:hidden">
        <PreviewPane
          compact
          device="phone"
          onDeviceChange={setDevice}
          state={{ business, style, pages, features }}
        />
        <p className="text-small mt-3 mb-8 text-center text-gray-700">
          This is your site as you edit it. Changes show here instantly.
        </p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div className="space-y-6">
          <StepNav step={step} onJump={setStep} />
          <div className="min-h-[320px]">{stepBody}</div>

          {step < 5 ? (
            <div className="flex items-center justify-between gap-3">
              <Button type="button" variant="ghost" onClick={back} disabled={step === 0}>
                Back
              </Button>
              <Button type="button" onClick={next}>
                <span className="sm:hidden">Next</span>
                <span className="hidden sm:inline">Next: {STEP_LABELS[step + 1]}</span>
              </Button>
            </div>
          ) : null}

          <div className="flex items-center justify-between">
            <button
              type="button"
              className="text-sm text-gray-500 underline-offset-2 hover:underline"
              onClick={() => {
                reset();
                confettiRef.current = false;
                setSharedBanner(false);
                setShareBroken(false);
              }}
            >
              Reset
            </button>
          </div>

          <div className="hidden lg:block">
            <PriceBar quote={quote} />
          </div>
        </div>

        <div className="sticky top-28 hidden lg:block">
          <PreviewPane
            device={device}
            onDeviceChange={setDevice}
            state={{ business, style, pages, features }}
          />
        </div>
      </div>

      <div className="lg:hidden">
        <div className="border-border bg-bg/95 fixed inset-x-0 bottom-0 z-40 border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
          <PriceBar quote={quote} />
        </div>
      </div>

      {toast ? (
        <div
          role="status"
          className="bg-navy fixed bottom-28 left-1/2 z-50 -translate-x-1/2 rounded-full px-4 py-2 text-sm font-medium text-white shadow-lg lg:bottom-8"
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}
