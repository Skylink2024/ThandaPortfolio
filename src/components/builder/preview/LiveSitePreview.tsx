'use client';

import { industries, pagesCatalog, stylePresets } from '@data/builder';
import type { BuilderState } from '@/store/builder';
import { cn } from '@/lib/cn';

const fontStacks: Record<string, { heading: string; body: string }> = {
  modern: {
    heading: 'var(--font-inter), system-ui, sans-serif',
    body: 'var(--font-inter), system-ui, sans-serif',
  },
  luxury: {
    heading: "Georgia, 'Times New Roman', serif",
    body: 'system-ui, sans-serif',
  },
  bold: {
    heading: "Impact, 'Arial Narrow', sans-serif",
    body: 'system-ui, sans-serif',
  },
  minimal: {
    heading: 'system-ui, sans-serif',
    body: 'system-ui, sans-serif',
  },
  playful: {
    heading: "'Trebuchet MS', ui-rounded, system-ui, sans-serif",
    body: 'system-ui, sans-serif',
  },
  corporate: {
    heading: 'system-ui, sans-serif',
    body: 'system-ui, sans-serif',
  },
  'space-grotesk': {
    heading: 'system-ui, sans-serif',
    body: 'var(--font-inter), system-ui, sans-serif',
  },
  poppins: {
    heading: 'system-ui, sans-serif',
    body: 'system-ui, sans-serif',
  },
};

export function LiveSitePreview({
  state,
  mobile = false,
}: {
  state: Pick<BuilderState, 'business' | 'style' | 'pages' | 'features'>;
  mobile?: boolean;
}) {
  const preset =
    stylePresets.find((p) => p.id === state.style.presetId) ?? stylePresets[0]!;
  const industry =
    industries.find((i) => i.id === state.business.industry) ?? industries[0]!;
  const name = state.business.name.trim() || 'Your Business';
  const location = state.business.location.trim() || 'Cape Town';
  const tagline =
    state.business.tagline.trim() || industry.suggestedTaglines[0] || '';
  const headline = industry.heroHeadline
    .replace('{name}', name)
    .replace('{location}', location);
  const fonts = fontStacks[state.style.fontPairId] ?? fontStacks.modern!;
  const radius = `${preset.radius}px`;
  const pill =
    preset.buttonStyle === 'pill' ? '999px' : preset.buttonStyle === 'square' ? '2px' : radius;
  const dark = preset.id === 'bold';
  const centered = preset.heroVariant === 'centered' || preset.heroVariant === 'editorial';
  const navPages = state.pages.filter((p) => p !== 'home').slice(0, mobile ? 0 : 5);
  const showWa = state.features.includes('whatsapp');
  const showShop = state.pages.includes('shop') || state.features.includes('shop');
  const showLang = state.features.includes('multilingual');

  return (
    <div
      className={cn(
        '[container-type:inline-size] relative flex h-full w-full flex-col overflow-y-auto',
      )}
      style={{
        background: state.style.primary === preset.primary ? preset.bg : preset.bg,
        color: preset.text,
        fontFamily: fonts.body,
        // Theme vars for children
        ['--p-primary' as string]: state.style.primary,
        ['--p-accent' as string]: state.style.accent,
        ['--p-bg' as string]: preset.bg,
        ['--p-text' as string]: preset.text,
        ['--p-radius' as string]: radius,
      }}
    >
      <header
        className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b"
        style={{
          borderColor: `${preset.text}18`,
          background: dark ? '#000' : preset.bg,
          padding: mobile ? '10px 14px' : '12px 20px',
        }}
      >
        <div className="flex min-w-0 items-center gap-2">
          {state.style.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={state.style.logoUrl}
              alt=""
              className="h-7 w-auto max-w-[96px] object-contain"
            />
          ) : (
            <span
              className="truncate font-bold"
              style={{ fontFamily: fonts.heading, color: state.style.primary, fontSize: mobile ? 14 : 16 }}
            >
              {name}
            </span>
          )}
        </div>
        {!mobile ? (
          <nav className="flex items-center gap-3 text-[11px] opacity-70">
            {navPages.map((id) => (
              <span key={id}>{pagesCatalog.find((p) => p.id === id)?.label ?? id}</span>
            ))}
            {showShop ? <span aria-hidden>🛒</span> : null}
            {showLang ? <span className="rounded border px-1 text-[10px]">EN</span> : null}
          </nav>
        ) : (
          <span className="flex flex-col gap-1 opacity-60" aria-hidden>
            <span className="block h-0.5 w-4 bg-current" />
            <span className="block h-0.5 w-4 bg-current" />
            <span className="block h-0.5 w-4 bg-current" />
          </span>
        )}
      </header>

      <section
        className={cn('flex', mobile || centered ? 'flex-col' : 'items-center')}
        style={{
          padding: mobile ? '28px 16px' : '40px 28px',
          gap: 20,
          textAlign: centered || mobile ? 'center' : 'left',
          alignItems: centered || mobile ? 'center' : undefined,
          background: dark
            ? `linear-gradient(135deg, #0a0a0a 50%, ${state.style.primary}55)`
            : `linear-gradient(135deg, ${preset.bg} 50%, ${state.style.primary}18)`,
        }}
      >
        <div className="min-w-0 flex-1">
          <p
            className="font-semibold tracking-widest uppercase"
            style={{ fontSize: 11, color: state.style.primary }}
          >
            {location}
          </p>
          <h2
            className={cn('mt-2 font-extrabold', dark && 'uppercase')}
            style={{
              fontFamily: fonts.heading,
              fontSize: mobile ? 28 : 36,
              lineHeight: 1.1,
            }}
          >
            {headline}
          </h2>
          {tagline ? (
            <p className="mt-3 opacity-75" style={{ fontSize: mobile ? 14 : 16 }}>
              {tagline}
            </p>
          ) : null}
          <span
            className="mt-5 inline-block font-semibold text-white"
            style={{
              background: state.style.primary,
              borderRadius: pill,
              padding: '10px 18px',
              fontSize: 13,
            }}
          >
            Get in touch
          </span>
        </div>
        {!mobile && !centered ? (
          <div
            className="aspect-[4/5] w-[34%] shrink-0"
            style={{
              borderRadius: radius,
              background: `linear-gradient(160deg, ${state.style.primary}, ${state.style.accent})`,
            }}
          />
        ) : null}
      </section>

      {state.pages.includes('services') || state.pages.includes('menu') ? (
        <section style={{ padding: mobile ? '16px' : '20px 28px' }}>
          <p className="mb-3 text-xs font-semibold tracking-wide uppercase opacity-60">
            {state.pages.includes('menu') ? 'Menu' : 'Services'}
          </p>
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4, 1fr)' }}
          >
            {industry.services.map((s) => (
              <div
                key={s.name}
                className="p-3 text-sm font-semibold"
                style={{
                  borderRadius: radius,
                  border: `1px solid ${preset.text}18`,
                  background: dark ? '#141414' : `${state.style.primary}10`,
                }}
              >
                <div>{s.name}</div>
                <div className="mt-1 text-[11px] font-normal opacity-60">{s.priceLabel}</div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {state.pages.includes('about') ? (
        <section style={{ padding: mobile ? '16px' : '12px 28px 24px' }}>
          <p className="mb-2 text-xs font-semibold tracking-wide uppercase opacity-60">About</p>
          <p className="text-sm opacity-80">
            {name} serves customers in {location}. Friendly service, clear pricing, and a website
            that works on every phone.
          </p>
        </section>
      ) : null}

      {state.pages.includes('gallery') ? (
        <section style={{ padding: mobile ? '12px 16px 20px' : '8px 28px 24px' }}>
          <p className="mb-3 text-xs font-semibold tracking-wide uppercase opacity-60">Gallery</p>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="aspect-square"
                style={{
                  borderRadius: radius,
                  background: `linear-gradient(${120 + i * 20}deg, ${state.style.primary}${i % 2 ? '66' : '99'}, ${state.style.accent}88)`,
                }}
              />
            ))}
          </div>
        </section>
      ) : null}

      {state.pages.includes('bookings') || state.features.includes('booking') ? (
        <section style={{ padding: mobile ? '12px 16px 20px' : '8px 28px 24px' }}>
          <p className="mb-3 text-xs font-semibold tracking-wide uppercase opacity-60">Book</p>
          <div className="flex flex-wrap gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d) => (
              <span
                key={d}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-white"
                style={{ background: state.style.primary }}
              >
                {d}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {showShop ? (
        <section style={{ padding: mobile ? '12px 16px 20px' : '8px 28px 24px' }}>
          <p className="mb-3 text-xs font-semibold tracking-wide uppercase opacity-60">Shop</p>
          <div className="grid grid-cols-2 gap-2">
            {['Product A', 'Product B'].map((p) => (
              <div
                key={p}
                className="p-3"
                style={{
                  borderRadius: radius,
                  border: `1px solid ${preset.text}18`,
                }}
              >
                <div
                  className="mb-2 aspect-square"
                  style={{
                    borderRadius: radius,
                    background: `${state.style.accent}33`,
                  }}
                />
                <p className="text-sm font-semibold">{p}</p>
                {state.features.includes('payments') ? (
                  <p className="mt-1 text-[11px]" style={{ color: state.style.primary }}>
                    Pay now
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {state.pages.includes('blog') || state.features.includes('blog') ? (
        <section style={{ padding: mobile ? '12px 16px 20px' : '8px 28px 24px' }}>
          <p className="mb-3 text-xs font-semibold tracking-wide uppercase opacity-60">Blog</p>
          <div className="space-y-2">
            {['Tips for your customers', 'Behind the scenes'].map((t) => (
              <div
                key={t}
                className="p-3 text-sm font-semibold"
                style={{
                  borderRadius: radius,
                  border: `1px solid ${preset.text}18`,
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {state.pages.includes('contact') ? (
        <section style={{ padding: mobile ? '12px 16px 24px' : '8px 28px 28px' }}>
          <p className="mb-3 text-xs font-semibold tracking-wide uppercase opacity-60">Contact</p>
          <div
            className="flex flex-col gap-3 p-4"
            style={{
              borderRadius: radius,
              border: `1px solid ${preset.text}18`,
              background: dark ? '#141414' : `${state.style.primary}08`,
            }}
          >
            {state.features.includes('contactForm') ? (
              <>
                <div className="h-8 rounded bg-white/50" style={{ background: `${preset.text}10` }} />
                <div className="h-8 rounded" style={{ background: `${preset.text}10` }} />
                <div className="h-16 rounded" style={{ background: `${preset.text}10` }} />
              </>
            ) : (
              <p className="text-sm opacity-70">
                {location} · WhatsApp us anytime
              </p>
            )}
            {state.features.includes('maps') ? (
              <div
                className="mt-1 flex h-24 items-center justify-center text-xs opacity-60"
                style={{
                  borderRadius: radius,
                  background: `${state.style.accent}22`,
                }}
              >
                Map preview · {location}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <footer
        className="mt-auto border-t px-4 py-3 text-center text-[10px] opacity-50"
        style={{ borderColor: `${preset.text}18` }}
      >
        © {name}
      </footer>

      {showWa ? (
        <span
          className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full text-lg text-white shadow-lg"
          style={{ background: '#25D366' }}
          aria-hidden
        >
          ✆
        </span>
      ) : null}
    </div>
  );
}
