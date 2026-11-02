'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Menu } from 'lucide-react';
import type { SiteConfig } from '@data/site';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { cn } from '@/lib/cn';
import { ease } from '@/lib/motion';

export interface NavbarProps {
  items: SiteConfig['nav'];
  className?: string;
}

export function Navbar({ items, className }: NavbarProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    lastY.current = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      setCompact(y > 24);

      if (y <= 400) {
        setHidden(false);
      } else if (y > lastY.current + 2) {
        setHidden(true);
      } else if (y < lastY.current - 2) {
        setHidden(false);
      }

      lastY.current = y;
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const overHero = pathname === '/' && !compact && !menuOpen;

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out',
          overHero
            ? 'border-b border-transparent bg-transparent'
            : 'glass border-x-0 border-t-0 shadow-[var(--shadow-sm)]',
          hidden && !menuOpen && '-translate-y-full',
          className,
        )}
        style={
          {
            '--nav-h': compact ? '60px' : '72px',
          } as React.CSSProperties
        }
      >
        <div
          className="container-brike flex items-center justify-between gap-4 transition-[height] duration-300 ease-out"
          style={{ height: 'var(--nav-h)' }}
        >
          <Link
            href="/"
            className="relative inline-flex shrink-0 items-center"
            aria-label="Brike Web home"
          >
            <motion.span
              animate={{ scale: compact ? 0.9 : 1 }}
              transition={
                reduced ? { duration: 0 } : { duration: 0.3, ease: ease.out }
              }
              className="inline-flex origin-left"
            >
              <Image
                src="/logo.png"
                alt="Brike Web home"
                width={116}
                height={64}
                priority
                className={cn('h-8 w-auto transition-[filter] duration-300', overHero && 'brightness-0 invert')}
              />
            </motion.span>
          </Link>

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Primary"
          >
            {items.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-3.5 py-2 text-small transition-colors',
                    overHero
                      ? active
                        ? 'text-white'
                        : 'text-white/70 hover:text-white'
                      : active
                        ? 'text-gray-900'
                        : 'text-gray-500 hover:text-gray-900',
                  )}
                >
                  {item.label}
                  {active ? (
                    <motion.span
                      layoutId="nav-underline"
                      className={cn(
                        'absolute right-3.5 bottom-0.5 left-3.5 h-px',
                        overHero ? 'bg-white' : 'bg-gray-900',
                      )}
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 380, damping: 34 }
                      }
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle className={overHero ? 'border-white/25 text-white' : undefined} />
            <Button
              href="/build"
              size="sm"
              variant="secondary"
              className={cn(
                'hidden md:inline-flex',
                overHero && '!text-navy-900 bg-white shadow-none hover:bg-white/90',
              )}
            >
              Design my site
            </Button>
            <button
              ref={menuButtonRef}
              type="button"
              className={cn(
                'inline-flex size-11 items-center justify-center rounded-[var(--radius-md)] border lg:hidden',
                overHero ? 'border-white/25 text-white' : 'border-border text-gray-900',
              )}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        items={items}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        returnFocusRef={menuButtonRef}
      />
    </>
  );
}
