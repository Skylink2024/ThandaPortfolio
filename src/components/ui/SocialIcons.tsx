import { cn } from '@/lib/cn';

export type SocialIconName = 'Instagram' | 'Facebook' | 'TikTok';

export function SocialIcon({
  name,
  className,
}: {
  name: SocialIconName;
  className?: string;
}) {
  const common = cn('size-5', className);

  if (name === 'Instagram') {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
      </svg>
    );
  }

  if (name === 'Facebook') {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden="true">
        <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.5l.5-3H14V9z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden="true">
      <path d="M14.5 4.5c.4 2.2 1.8 4 3.9 4.8v2.3c-1.4-.1-2.7-.5-3.9-1.2v5.7c0 3.1-2.5 5.6-5.6 5.6S3.3 19.2 3.3 16.1c0-3 2.3-5.4 5.2-5.6v2.4c-1.4.2-2.4 1.3-2.4 2.8 0 1.6 1.3 2.9 2.9 2.9s2.9-1.3 2.9-2.9V4.5h2.6z" />
    </svg>
  );
}
