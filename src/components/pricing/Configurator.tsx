'use client';

import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { Minus, Plus, ReceiptText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Price } from '@/components/ui/Price';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Segmented } from '@/components/ui/Segmented';
import { Toggle } from '@/components/ui/Toggle';
import { cn } from '@/lib/cn';
import { formatZAR } from '@/lib/format';
import {
  buildQuote,
  EMPTY_SELECTION,
  formatPrice,
  getExtra,
  getPackage,
  isIncludedIn,
  toggleExtra,
  type Selection,
} from '@/lib/pricing';
import { extras as allExtras, packages, type Extra, type PackageId } from '@data/pricing';
import { site } from '@data/site';
import { ConfiguratorSummary } from './ConfiguratorSummary';
import { SELECT_PACKAGE_EVENT } from './PackageGrid';
import { QuoteModal } from './QuoteModal';

export interface ConfiguratorProps {
  initialPackage?: PackageId;
}

const MAX_EXTRA_PAGES = 10;

type Hosting = 'none' | 'hostingBasic' | 'hostingBusiness';

interface State {
  packageId: PackageId;
  extraPages: number;
  extras: Extra['id'][];
}

type Action =
  | { type: 'package'; id: PackageId }
  | { type: 'toggle'; id: Extra['id'] }
  | { type: 'hosting'; value: Hosting }
  | { type: 'pages'; value: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'package':
      return { ...state, packageId: action.id };
    case 'toggle':
      return { ...state, extras: toggleExtra(state.extras, action.id) };
    case 'hosting': {
      const without = state.extras.filter((id) => id !== 'hostingBasic' && id !== 'hostingBusiness');
      return {
        ...state,
        extras: action.value === 'none' ? without : toggleExtra(without, action.value),
      };
    }
    case 'pages':
      return { ...state, extraPages: Math.min(MAX_EXTRA_PAGES, Math.max(0, action.value)) };
  }
}

function isPackageId(value: string | null): value is PackageId {
  return packages.some((p) => p.id === value);
}

/** Selection fed to buildQuote: the user's chosen package plus extra pages and extras. */
function toSelection(state: State): Selection {
  const pkg = getPackage(state.packageId);
  return {
    ...EMPTY_SELECTION,
    pages: pkg.capability.maxPages + state.extraPages,
    extras: state.extras,
    forcedPackage: state.packageId,
  };
}

/** Builder link that carries the configurator selection. */
function buildPath(state: State): string {
  const params = new URLSearchParams({ package: state.packageId });
  if (state.extras.length) params.set('extras', state.extras.join(','));
  if (state.extraPages) params.set('extraPages', String(state.extraPages));
  return `/build?${params.toString()}`;
}

const extraGroups: { title: string; ids: Extra['id'][] }[] = [
  { title: 'Essentials', ids: ['domain'] },
  { title: 'Get found on Google', ids: ['gbpSetup', 'gbpCare', 'seoOnce', 'localSeo', 'googleStarter'] },
  { title: 'Support & care', ids: ['care', 'extraChanges'] },
];

export function Configurator({ initialPackage = 'business' }: ConfiguratorProps) {
  const [state, dispatch] = useReducer(reducer, {
    packageId: initialPackage,
    extraPages: 0,
    extras: [],
  });
  const [emailOpen, setEmailOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { amount: 0.05 });

  // "Choose {name}" buttons in the package grid and ?package= in the URL.
  useEffect(() => {
    function onSelect(e: Event) {
      const id = (e as CustomEvent<PackageId>).detail;
      if (isPackageId(id)) dispatch({ type: 'package', id });
    }
    window.addEventListener(SELECT_PACKAGE_EVENT, onSelect);

    const fromUrl = new URLSearchParams(window.location.search).get('package');
    if (isPackageId(fromUrl)) dispatch({ type: 'package', id: fromUrl });

    return () => window.removeEventListener(SELECT_PACKAGE_EVENT, onSelect);
  }, []);

  const quote = useMemo(() => buildQuote(toSelection(state)), [state]);
  const path = buildPath(state);
  const shareUrl = `${site.url}${path}`;
  const hosting: Hosting = state.extras.includes('hostingBusiness')
    ? 'hostingBusiness'
    : state.extras.includes('hostingBasic')
      ? 'hostingBasic'
      : 'none';
  const pkg = getPackage(state.packageId);
  const basic = getExtra('hostingBasic');
  const business = getExtra('hostingBusiness');
  const extraPage = getExtra('extraPage');

  const summary = (
    <ConfiguratorSummary quote={quote} buildHref={path} onEmail={() => setEmailOpen(true)} />
  );

  return (
    <Section id="configurator" tone="default" className="scroll-mt-20 pb-28 lg:pb-[var(--section-pad-y)]">
      <SectionHeading
        eyebrow="Configurator"
        title="Build your price"
        subtitle="Pick a package, add what you need, and see your price instantly. No sign-up."
      />

      <div ref={sectionRef} className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-10">
          {/* Step A */}
          <fieldset>
            <legend className="text-h3 mb-4 text-gray-900">
              <span className="text-blue mr-2">A.</span>Choose your package
            </legend>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {packages.map((p) => (
                <label
                  key={p.id}
                  className={cn(
                    'border-border bg-bg relative flex cursor-pointer flex-col rounded-[var(--radius-md)] border p-4 transition-colors',
                    'has-[:focus-visible]:outline-blue has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2',
                    'has-[:checked]:border-blue has-[:checked]:bg-blue-100',
                    p.popular && 'border-gray-900',
                  )}
                >
                  <input
                    type="radio"
                    name="configurator-package"
                    value={p.id}
                    checked={state.packageId === p.id}
                    onChange={() => dispatch({ type: 'package', id: p.id })}
                    className="sr-only"
                  />
                  {p.popular ? (
                    <span className="bg-blue text-micro absolute -top-2.5 right-3 rounded-[var(--radius-sm)] px-2 py-0.5 font-semibold text-white">
                      Most popular
                    </span>
                  ) : null}
                  <span className="font-semibold text-gray-900">{p.name}</span>
                  <span className="font-mono text-lg font-bold text-gray-900">
                    {formatZAR(p.price)}
                  </span>
                  <span className="text-micro text-gray-500">once-off</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Step B */}
          <div>
            <h3 className="text-h3 mb-4 text-gray-900">
              <span className="text-blue mr-2">B.</span>Add extras
            </h3>

            <div className="space-y-8">
              {extraGroups.map((group) => (
                <div key={group.title}>
                  <h4 className="text-small mb-3 font-semibold tracking-wide text-gray-500 uppercase">
                    {group.title}
                  </h4>
                  <div className="space-y-3">
                    {group.title === 'Essentials' ? (
                      <>
                        {/* Hosting: 3-way */}
                        <div className="border-border bg-bg rounded-[var(--radius-md)] border p-4">
                          <p className="font-semibold text-gray-900" id="hosting-label">
                            Hosting
                          </p>
                          <p className="text-small mt-1 text-gray-500">
                            Keeps your website online, fast and secure.
                          </p>
                          <Segmented<Hosting>
                            ariaLabel="Hosting"
                            className="mt-3 w-full [&>button]:flex-1"
                            value={hosting}
                            onChange={(value) => dispatch({ type: 'hosting', value })}
                            options={[
                              { value: 'none', label: 'No hosting' },
                              { value: 'hostingBasic', label: `Basic ${formatZAR(basic.price)}/m` },
                              {
                                value: 'hostingBusiness',
                                label: `Business ${formatZAR(business.price)}/m`,
                              },
                            ]}
                          />
                        </div>

                        {/* Extra pages stepper */}
                        <div className="border-border bg-bg flex items-center justify-between gap-4 rounded-[var(--radius-md)] border p-4">
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900" id="extra-pages-label">
                              Extra pages
                            </p>
                            <p className="text-small text-blue mt-1 font-medium">
                              +{formatZAR(extraPage.price)} each
                            </p>
                            <p className="text-micro mt-1 text-gray-500">
                              On top of the {pkg.capability.maxPages}{' '}
                              {pkg.capability.maxPages === 1 ? 'page' : 'pages'} in {pkg.name}.
                            </p>
                          </div>
                          <div
                            role="group"
                            aria-labelledby="extra-pages-label"
                            className="flex shrink-0 items-center gap-1"
                          >
                            <button
                              type="button"
                              aria-label="Remove an extra page"
                              disabled={state.extraPages <= 0}
                              onClick={() => dispatch({ type: 'pages', value: state.extraPages - 1 })}
                              className="border-border hover:border-blue flex size-11 items-center justify-center rounded-full border text-gray-900 disabled:opacity-40"
                            >
                              <Minus className="size-4" aria-hidden="true" />
                            </button>
                            <output
                              aria-live="polite"
                              className="w-10 text-center font-mono text-lg font-bold text-gray-900"
                            >
                              {state.extraPages}
                            </output>
                            <button
                              type="button"
                              aria-label="Add an extra page"
                              disabled={state.extraPages >= MAX_EXTRA_PAGES}
                              onClick={() => dispatch({ type: 'pages', value: state.extraPages + 1 })}
                              className="border-border hover:border-blue flex size-11 items-center justify-center rounded-full border text-gray-900 disabled:opacity-40"
                            >
                              <Plus className="size-4" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </>
                    ) : null}

                    {group.ids.map((id) => {
                      const extra = allExtras.find((e) => e.id === id)!;
                      const included = isIncludedIn(id, state.packageId);
                      return (
                        <Toggle
                          key={id}
                          label={extra.name}
                          description={extra.description}
                          priceLabel={formatPrice(extra.price, extra.billing)}
                          checked={included || state.extras.includes(id)}
                          disabled={included}
                          badge={included ? 'Included' : undefined}
                          onChange={() => dispatch({ type: 'toggle', id })}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: sticky on lg, bottom sheet on mobile */}
        <aside aria-label="Quote summary" className="hidden lg:sticky lg:top-24 lg:block">
          {summary}
        </aside>
      </div>

      {/* Mobile bar + bottom sheet */}
      <div className="lg:hidden">
        {inView && !sheetOpen ? (
          <div className="glass fixed inset-x-0 bottom-0 z-40 border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
              <div className="min-w-0">
                {quote.overCap ? (
                  <p className="text-small font-semibold text-gray-900">Let&apos;s chat, custom quote</p>
                ) : (
                  <Price amount={quote.onceOff} animate size="sm" />
                )}
                <p className="text-micro text-gray-500">
                  {quote.monthly > 0 ? `+ ${formatZAR(quote.monthly)}/month` : 'No monthly costs'}
                </p>
              </div>
              <Button
                size="sm"
                icon={<ReceiptText className="size-4" />}
                onClick={() => setSheetOpen(true)}
                aria-haspopup="dialog"
              >
                View quote
              </Button>
            </div>
          </div>
        ) : null}
        <Dialog open={sheetOpen} onClose={() => setSheetOpen(false)} title="Your quote" variant="sheet">
          <ConfiguratorSummary
            quote={quote}
            buildHref={path}
            onEmail={() => {
              setSheetOpen(false);
              setEmailOpen(true);
            }}
          />
        </Dialog>
      </div>

      <QuoteModal open={emailOpen} onClose={() => setEmailOpen(false)} quote={quote} shareUrl={shareUrl} />
    </Section>
  );
}
