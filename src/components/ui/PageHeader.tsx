import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';

export interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  /** One word in the title, set in the serif italic accent. */
  accent?: string;
}

function titleWithAccent(title: string, accent?: string) {
  if (!accent) return title;
  const index = title.indexOf(accent);
  if (index === -1) return title;
  return (
    <>
      {title.slice(0, index)}
      <span className="accent-word">{accent}</span>
      {title.slice(index + accent.length)}
    </>
  );
}

/** Left-aligned editorial page intro used at the top of every inner page. */
export function PageHeader({ eyebrow, title, subtitle, className, children, accent }: PageHeaderProps) {
  return (
    <header className={cn('border-border bg-bg border-b pt-28 pb-14 md:pt-40 md:pb-20', className)}>
      <div className="container-brike">
        <Reveal>
          <p className="text-micro flex items-center gap-3 text-gray-500">
            <span aria-hidden="true" className="bg-gray-900 h-px w-8" />
            {eyebrow}
          </p>
          <h1 className="text-display mt-6 max-w-5xl text-gray-900">{titleWithAccent(title, accent)}</h1>
          {subtitle ? (
            <p className="text-lead mt-6 max-w-2xl text-gray-700">{subtitle}</p>
          ) : null}
          {children}
        </Reveal>
      </div>
    </header>
  );
}
