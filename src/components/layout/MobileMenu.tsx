'use client';

import { useEffect, useId, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import type { SiteConfig } from '@data/site';
import { site } from '@data/site';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { SocialIcon } from '@/components/ui/SocialIcons';
import { Logo } from '@/components/layout/Logo';
import { whatsappLink } from '@/lib/whatsapp';
import { duration, ease } from '@/lib/motion';

export interface MobileMenuProps {
  items: SiteConfig['nav'];
  open: boolean;
  onClose(): void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}

export function MobileMenu({
  items,
  open,
  onClose,
  returnFocusRef,
}: MobileMenuProps) {
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const waHref = whatsappLink(
    site.whatsappNumber,
    "Hi Thanda, I found Brike Web and I'd like a website.",
  );

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusReturnTarget = returnFocusRef?.current ?? null;

    const panel = panelRef.current;
    const focusables = panel
      ? Array.from(
          panel.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        )
      : [];

    focusables[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || focusables.length === 0) return;

      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      focusReturnTarget?.focus();
    };
  }, [open, onClose, returnFocusRef]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-50 flex flex-col bg-navy p-6 text-white"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: duration.base, ease: ease.out }}
        >
          <div className="mb-8 flex items-center justify-between">
            <p id={titleId} className="font-heading text-lg font-extrabold">
              <Logo tone="dark" className="h-8" />
              <span className="sr-only">Menu</span>
            </p>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-white/20"
              aria-label="Close menu"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <nav className="flex flex-col gap-2" aria-label="Mobile">
            {items.map((item, index) => (
              <motion.div
                key={item.href}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: reduced ? 0 : index * 0.05,
                  duration: duration.base,
                  ease: ease.out,
                }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block py-1 font-heading text-[28px] font-bold leading-tight"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-3 pt-10">
            <Button href="/build" fullWidth onClick={onClose}>
              Design my site
            </Button>
            <Button
              href={waHref}
              variant="whatsapp"
              fullWidth
              onClick={onClose}
            >
              WhatsApp
            </Button>

            <div className="mt-4 flex items-center justify-center gap-3">
              {site.socials.map((social) => {
                if (social.placeholder) {
                  return (
                    <Tooltip key={social.label} content="Coming soon">
                      <span
                        aria-disabled="true"
                        className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 text-white/50"
                      >
                        <SocialIcon name={social.label} />
                        <span className="sr-only">{social.label} coming soon</span>
                      </span>
                    </Tooltip>
                  );
                }

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex size-11 items-center justify-center rounded-[var(--radius-sm)] border border-white/20 text-white transition-colors hover:border-white/50"
                  >
                    <SocialIcon name={social.label} />
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
