import { cn } from '@/lib/cn';

export interface LogoProps {
  /** `dark` is the white wordmark for navy backgrounds. `light` is the navy wordmark. */
  tone?: 'light' | 'dark';
  className?: string;
  priority?: boolean;
}

export function Logo({ tone = 'light', className, priority = false }: LogoProps) {
  const src = tone === 'dark' ? '/brand/logo-on-dark.svg' : '/brand/logo-on-light.svg';

  return (
    <img
      src={src}
      alt=""
      width={792}
      height={164}
      fetchPriority={priority ? 'high' : 'auto'}
      className={cn('h-7 w-auto sm:h-8 md:h-9', className)}
    />
  );
}
