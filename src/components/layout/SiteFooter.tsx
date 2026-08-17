import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/skills", label: "Skills" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="section-pad border-t border-gold/15 py-10 md:py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <Image
            src="/brand/mark.png"
            alt=""
            width={48}
            height={48}
            className="h-10 w-10 object-contain sm:h-12 sm:w-12"
          />
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-display)] text-lg tracking-[0.12em] text-cream sm:text-xl sm:tracking-[0.16em]">
              THANDA MANUEL
            </p>
            <p className="mt-1 text-[10px] tracking-[0.2em] text-gold uppercase sm:text-xs sm:tracking-[0.28em]">
              Purpose · Disciple · Legacy
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs tracking-[0.18em] text-cream-dim uppercase transition hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-sm text-cream-dim">
          © {new Date().getFullYear()} · Cape Town, South Africa
        </p>
      </div>
    </footer>
  );
}
