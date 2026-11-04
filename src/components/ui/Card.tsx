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
        'rounded-[var(--radius-lg)] border border-border bg-bg text-gray-900',
        padded && 'p-6',
        interactive &&
          'transition-[border-color,transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-navy/30 hover:shadow-[var(--shadow-md)]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
