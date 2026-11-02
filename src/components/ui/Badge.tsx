import { cn } from '@/lib/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'blue' | 'success' | 'warning' | 'danger';
}

const tones: Record<NonNullable<BadgeProps['tone']>, string> = {
  neutral: 'bg-surface-2 text-gray-700',
  blue: 'bg-blue-100 text-blue',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
};

export function Badge({ tone = 'neutral', className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[var(--radius-sm)] px-2.5 py-1 text-micro',
        tones[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
