import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';
import { MobileStickyCta } from '@/components/layout/MobileStickyCta';
import { PageTransition } from '@/components/layout/PageTransition';
import { site } from '@data/site';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar items={site.nav} />
      <main id="main" className="flex flex-1 flex-col">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <FloatingWhatsApp />
      <MobileStickyCta />
    </SmoothScroll>
  );
}
