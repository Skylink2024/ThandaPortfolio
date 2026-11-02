import Link from 'next/link';
import { cn } from '@/lib/cn';

type ButtonClickEvent = React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>;

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'whatsapp' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: (event: ButtonClickEvent) => void;
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-blue text-white hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] hover:bg-blue-600',
  secondary: 'bg-navy text-white hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]',
  ghost: 'bg-transparent text-gray-900 hover:bg-blue-100',
  whatsapp: 'bg-whatsapp text-white hover:-translate-y-0.5 hover:brightness-105',
  outline:
    'border border-border bg-transparent text-gray-900 hover:border-blue hover:text-blue',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-5 text-base',
  lg: 'h-14 px-6 text-lg',
};

function isExternalHref(href: string) {
  return (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  type = 'button',
  onClick,
  ...rest
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-semibold transition-all duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue disabled:pointer-events-none disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className,
  );

  const content = (
    <>
      {icon && iconPosition === 'left' ? <span aria-hidden="true">{icon}</span> : null}
      <span>{loading ? 'Loading…' : children}</span>
      {icon && iconPosition === 'right' ? <span aria-hidden="true">{icon}</span> : null}
    </>
  );

  if (href) {
    if (isExternalHref(href)) {
      return (
        <a
          href={href}
          className={classes}
          aria-disabled={disabled || loading || undefined}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          onClick={onClick}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className={classes}
        aria-disabled={disabled || loading || undefined}
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {content}
    </button>
  );
}
