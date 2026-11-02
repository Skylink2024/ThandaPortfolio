'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { site } from '@data/site';
import { whatsappLink } from '@/lib/whatsapp';
import { cn } from '@/lib/cn';

export interface MobileStickyCtaProps {
  className?: string;
}

/** True once the visitor has scrolled far enough for the mobile action bar. */
export function useStickyCtaVisible() {
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('hero');

    if (hero) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setPastHero(!entry?.isIntersecting);
        },
        { threshold: 0.15 },
      );
      observer.observe(hero);
      return () => observer.disconnect();
    }

    function onScroll() {
      setPastHero(window.scrollY > window.innerHeight * 0.6);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  const hiddenRoute = pathname.startsWith('/build') || pathname.startsWith('/contact');
  return !hiddenRoute && pastHero;
}

export function MobileStickyCta({ className }: MobileStickyCtaProps) {
  const waHref = whatsappLink(
    site.whatsappNumber,
    "Hi Thanda, I found Brike Web and I'd like a website.",
  );
  const visible = useStickyCtaVisible();

  if (!visible) return null;

  return (
    <div
      className={cn(
        'glass fixed inset-x-0 bottom-0 z-30 border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden',
        className,
      )}
    >
      <div className="flex gap-2">
        <Button href="/build" fullWidth size="sm">
          Design my website
        </Button>
        <Button href={waHref} variant="whatsapp" fullWidth size="sm">
          WhatsApp
        </Button>
      </div>
    </div>
  );
}
