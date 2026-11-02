import { cn } from '@/lib/cn';

export interface SectionProps {
  id?: string;
  tone?: 'default' | 'surface' | 'navy';
  className?: string;
  children: React.ReactNode;
}

const tones: Record<NonNullable<SectionProps['tone']>, string> = {
  default: 'bg-bg text-gray-700',
  surface: 'bg-surface text-gray-700',
  navy: 'bg-navy text-white',
};

export function Section({ id, tone = 'default', className, children }: SectionProps) {
  return (
    <section
      id={id}
      className={cn('py-[var(--section-pad-y)]', tones[tone], className)}
    >
      <div className="container-brike">{children}</div>
    </section>
  );
}
