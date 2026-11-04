import { cn } from '@/lib/cn';
import { designContent, getPreset, type ExampleDesign } from './exampleDesigns';

const headingFamily: Record<string, string> = {
  bold: "Impact, 'Arial Narrow', sans-serif",
  luxury: "Georgia, 'Times New Roman', serif",
  playful: "'Trebuchet MS', ui-rounded, system-ui, sans-serif",
  modern: 'var(--font-inter), system-ui, sans-serif',
};

export interface MiniSiteProps {
  design: ExampleDesign;
  /** Mobile layout (single column) — used inside the phone frame. */
  mobile?: boolean;
  className?: string;
}

/**
 * Stylised, static stand-in for a builder preview. Sizes use container query
 * units (cqw) so it scales with whatever frame it is rendered in.
 */
export function MiniSite({ design, mobile = false, className }: MiniSiteProps) {
  const preset = getPreset(design.preset);
  const { headline, tagline, services } = designContent(design);
  const radius = `${Math.round(preset.radius / (mobile ? 2 : 1.6))}px`;
  const family = headingFamily[preset.id] ?? headingFamily.modern;
  const dark = preset.id === 'bold';
  const centered = preset.heroVariant === 'centered' || preset.heroVariant === 'editorial';
  const pillRadius = preset.buttonStyle === 'pill' ? '999px' : radius;

  const h = (n: number) => `${n}cqw`;

  return (
    <div
      aria-hidden="true"
      className={cn(
        '[container-type:inline-size] flex h-full w-full flex-col overflow-hidden',
        className,
      )}
      style={{
        background: preset.bg,
        color: preset.text,
        fontFamily: 'var(--font-inter), system-ui',
      }}
    >
      {/* header */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: `${h(mobile ? 3.5 : 1.6)} ${h(mobile ? 5 : 3.5)}`,
          background: dark ? '#000' : preset.bg,
          borderBottom: `1px solid ${preset.text}1f`,
        }}
      >
        <span
          className="truncate font-bold"
          style={{ fontFamily: family, fontSize: h(mobile ? 5.5 : 2.2), color: preset.primary }}
        >
          {design.name}
        </span>
        {mobile ? (
          <span className="flex flex-col gap-[0.8cqw]">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block h-[0.7cqw] w-[5cqw]"
                style={{ background: preset.text }}
              />
            ))}
          </span>
        ) : (
          <span className="flex" style={{ gap: h(2), fontSize: h(1.5), opacity: 0.7 }}>
            <span>Home</span>
            <span>Services</span>
            <span>Gallery</span>
            <span>Contact</span>
          </span>
        )}
      </div>

      {/* hero */}
      <div
        className={cn(
          'flex flex-1',
          mobile || centered ? 'flex-col justify-center' : 'items-center',
        )}
        style={{
          padding: `${h(mobile ? 6 : 3)} ${h(mobile ? 5 : 4)}`,
          gap: h(mobile ? 4 : 3),
          textAlign: centered ? 'center' : 'left',
          alignItems: centered || mobile ? 'center' : undefined,
          background: dark
            ? `linear-gradient(135deg, #0a0a0a 55%, ${preset.primary}55)`
            : `linear-gradient(135deg, ${preset.bg} 55%, ${preset.primary}22)`,
        }}
      >
        <div className="min-w-0 flex-1">
          <p
            className="font-semibold tracking-widest uppercase"
            style={{ fontSize: h(mobile ? 3 : 1.2), color: preset.primary }}
          >
            {design.location}
          </p>
          <p
            className={cn('font-extrabold', dark && 'uppercase')}
            style={{
              fontFamily: family,
              fontSize: h(mobile ? 8.5 : 4),
              lineHeight: 1.08,
              marginTop: h(mobile ? 2 : 0.8),
            }}
          >
            {headline}
          </p>
          <p
            style={{ fontSize: h(mobile ? 3.6 : 1.6), opacity: 0.75, marginTop: h(mobile ? 2 : 1) }}
          >
            {tagline}
          </p>
          <span
            className="inline-block font-semibold"
            style={{
              marginTop: h(mobile ? 4 : 1.8),
              padding: `${h(mobile ? 2.4 : 1)} ${h(mobile ? 5 : 2.4)}`,
              fontSize: h(mobile ? 3.4 : 1.4),
              background: preset.primary,
              color: '#fff',
              borderRadius: pillRadius,
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
              background: `linear-gradient(160deg, ${preset.primary}, ${preset.accent})`,
              opacity: 0.9,
            }}
          />
        ) : null}
      </div>

      {/* services */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: h(mobile ? 2.5 : 1.4),
          padding: `${h(mobile ? 4 : 2)} ${h(mobile ? 5 : 4)}`,
        }}
      >
        {services.slice(0, mobile ? 2 : 4).map((s) => (
          <div
            key={s}
            className="truncate font-semibold"
            style={{
              padding: h(mobile ? 3 : 1.4),
              fontSize: h(mobile ? 3.2 : 1.35),
              borderRadius: radius,
              border: `1px solid ${preset.text}22`,
              background: dark ? '#141414' : `${preset.primary}10`,
            }}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}
