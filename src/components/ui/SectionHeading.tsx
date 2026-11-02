import { cn } from '@/lib/cn';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div className={cn('mb-10 max-w-3xl', align === 'center' && 'mx-auto text-center')}>
      {eyebrow ? <p className="mb-3 text-micro text-blue">{eyebrow}</p> : null}
      <h2 className="text-h2 text-gray-900">{title}</h2>
      {subtitle ? <p className="mt-4 text-lead text-gray-500">{subtitle}</p> : null}
    </div>
  );
}
