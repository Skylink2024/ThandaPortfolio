import { cn } from '@/lib/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export function Skeleton({ rounded = 'md', className, ...rest }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse bg-surface-2',
        rounded === 'sm' && 'rounded-[var(--radius-sm)]',
        rounded === 'md' && 'rounded-[var(--radius-md)]',
        rounded === 'lg' && 'rounded-[var(--radius-lg)]',
        rounded === 'full' && 'rounded-full',
        className,
      )}
      {...rest}
    />
  );
}
