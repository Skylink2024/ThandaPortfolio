'use client';

import { useRef, useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface ThemeToggleProps {
  className?: string;
}

function subscribe() {
  return () => {};
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className={cn(
          'inline-flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-border',
          className,
        )}
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  function toggle() {
    const next = isDark ? 'light' : 'dark';
    const button = buttonRef.current;

    const canReveal =
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      button &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (canReveal) {
      const rect = button.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      const transition = (
        document as Document & {
          startViewTransition: (cb: () => void) => { ready: Promise<void> };
        }
      ).startViewTransition(() => {
        setTheme(next);
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 450,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        );
      });
      return;
    }

    setTheme(next);
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggle}
      className={cn(
        'inline-flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-border text-gray-900',
        className,
      )}
    >
      <span className="relative size-5">
        <Sun
          className={cn(
            'absolute inset-0 size-5 transition-all duration-300 ease-out',
            isDark
              ? 'rotate-0 scale-100 opacity-100'
              : 'rotate-90 scale-75 opacity-0',
          )}
          aria-hidden="true"
        />
        <Moon
          className={cn(
            'absolute inset-0 size-5 transition-all duration-300 ease-out',
            isDark
              ? '-rotate-90 scale-75 opacity-0'
              : 'rotate-0 scale-100 opacity-100',
          )}
          aria-hidden="true"
        />
      </span>
    </button>
  );
}
