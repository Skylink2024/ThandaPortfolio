import { cn } from '@/lib/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  padded?: boolean;
}

export function Card({
  interactive = false,
  padded = true,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] border border-border bg-bg shadow-[var(--shadow-sm)]',
        padded && 'p-6',
        interactive &&
          'transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
