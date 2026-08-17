"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/skills", label: "Skills" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [navPath, setNavPath] = useState(pathname);

  if (navPath !== pathname) {
    setNavPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500",
        scrolled || open
          ? "border-b border-gold/20 bg-[color:var(--nav-bg)] shadow-[0_10px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="section-pad mx-auto flex h-16 max-w-7xl items-center justify-between md:h-[4.5rem]">
        <Link
          href="/"
          className="group flex min-w-0 items-center"
          onClick={() => setOpen(false)}
          aria-label="Home"
        >
          <Image
            src="/brand/mark.png"
            alt="Thanda Manuel"
            width={44}
            height={44}
            className="h-9 w-9 shrink-0 object-contain transition duration-500 group-hover:scale-105 sm:h-10 sm:w-10 md:h-11 md:w-11"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-xs tracking-[0.18em] uppercase transition after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-gold after:transition-all xl:tracking-[0.22em]",
                  active
                    ? "text-gold after:w-full"
                    : "text-cream-dim after:w-0 hover:text-gold hover:after:w-full",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center text-cream"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-gold/15 bg-[color:var(--nav-bg)] px-6 py-6 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-sm px-2 py-3 text-sm tracking-[0.2em] uppercase",
                    active ? "text-gold" : "text-cream",
                  )}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
