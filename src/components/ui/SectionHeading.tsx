import { cn } from '@/lib/cn';

export interface SectionHeadingProps {
  eyebrow?: string;
  /** Section number shown before the eyebrow, e.g. "01". */
  index?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  /** Right-hand slot on large screens (e.g. a "See all" link). */
  action?: React.ReactNode;
  /** One word in the title, set in the serif italic accent. */
  accent?: string;
  /** Light type for a navy section. */
  onDark?: boolean;
}

function titleWithAccent(title: string, accent?: string, onDark?: boolean) {
  if (!accent) return title;
  const index = title.indexOf(accent);
  if (index === -1) return title;
  return (
    <>
      {title.slice(0, index)}
      <span className={cn('accent-word', onDark && 'on-dark')}>{accent}</span>
      {title.slice(index + accent.length)}
    </>
  );
}

export function SectionHeading({
  eyebrow,
  index,
  title,
  subtitle,
  align = 'left',
  action,
  accent,
  onDark = false,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div className={cn('mb-12 md:mb-16', centered && 'mx-auto max-w-3xl text-center')}>
      {eyebrow || index ? (
        <p
          className={cn(
            'text-micro mb-5 flex items-center gap-3',
            onDark ? 'text-white/70' : 'text-gray-500',
            centered && 'justify-center',
          )}
        >
          {index ? (
            <span className={cn('tabular-nums', onDark ? 'text-orange' : 'text-gray-900')}>{index}</span>
          ) : null}
          {index && eyebrow ? (
            <span aria-hidden="true" className={cn('h-px w-8', onDark ? 'bg-white/40' : 'bg-gray-300')} />
          ) : null}
          {eyebrow ? <span>{eyebrow}</span> : null}
        </p>
      ) : null}
      <div
        className={cn(
          'flex flex-col gap-6',
          !centered && action && 'md:flex-row md:items-end md:justify-between',
        )}
      >
        <div className={cn(!centered && 'max-w-3xl')}>
          <h2 className={cn('text-h2', onDark ? 'text-white' : 'text-gray-900')}>
            {titleWithAccent(title, accent, onDark)}
          </h2>
          {subtitle ? (
            <p className={cn('text-lead mt-4', onDark ? 'text-white/80' : 'text-gray-700')}>{subtitle}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
