import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="section-pad border-t border-gold/15 py-10 md:py-12">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <Link href="/" aria-label="Thanda Manuel — Home" className="shrink-0">
          <Image
            src="/brand/logo-transparent.png"
            alt="Thanda Manuel"
            width={360}
            height={154}
            className="h-auto w-[min(42vw,180px)] object-contain opacity-90 transition hover:opacity-100 sm:w-[200px]"
          />
        </Link>
        <p className="text-right text-sm text-cream-dim">
          © {new Date().getFullYear()} · Cape Town, South Africa
        </p>
      </div>
    </footer>
  );
}
