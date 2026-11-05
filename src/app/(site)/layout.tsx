import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';
import { MobileStickyCta } from '@/components/layout/MobileStickyCta';
import { PageTransition } from '@/components/layout/PageTransition';
import { AmbientField } from '@/components/layout/AmbientField';
import { BrikeBuddy } from '@/components/layout/BrikeBuddy';
import { site } from '@data/site';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AmbientField />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar items={site.nav} />
      <main id="main" className="relative z-[1] flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
        <PageTransition>{children}</PageTransition>
      </main>
      <div className="relative z-[1]">
        <Footer />
      </div>
      <BrikeBuddy />
      <FloatingWhatsApp />
      <MobileStickyCta />
    </>
  );
}
