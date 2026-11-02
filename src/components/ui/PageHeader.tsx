import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';

export interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

/** Left-aligned editorial page intro used at the top of every inner page. */
export function PageHeader({ eyebrow, title, subtitle, className, children }: PageHeaderProps) {
  return (
    <header className={cn('border-border border-b pt-28 pb-14 md:pt-40 md:pb-20', className)}>
      <div className="container-brike">
        <Reveal>
          <p className="text-micro flex items-center gap-3 text-gray-700">
            <span aria-hidden="true" className="bg-gray-900 h-px w-8" />
            {eyebrow}
          </p>
          <h1 className="text-display mt-6 max-w-5xl text-gray-900">{title}</h1>
          {subtitle ? (
            <p className="text-lead mt-6 max-w-2xl text-gray-700">{subtitle}</p>
          ) : null}
          {children}
        </Reveal>
      </div>
    </header>
  );
}
