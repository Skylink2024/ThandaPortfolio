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
}

export function SectionHeading({
  eyebrow,
  index,
  title,
  subtitle,
  align = 'left',
  action,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div className={cn('mb-12 md:mb-16', centered && 'mx-auto max-w-3xl text-center')}>
      {eyebrow || index ? (
        <p
          className={cn(
            'text-micro mb-5 flex items-center gap-3 text-gray-700',
            centered && 'justify-center',
          )}
        >
          {index ? <span className="text-gray-900 tabular-nums">{index}</span> : null}
          {index && eyebrow ? <span aria-hidden="true" className="bg-gray-300 h-px w-8" /> : null}
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
          <h2 className="text-h2 text-gray-900">{title}</h2>
          {subtitle ? <p className="text-lead mt-4 text-gray-700">{subtitle}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
