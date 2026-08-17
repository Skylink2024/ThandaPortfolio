"use client";

import { useEffect, useState } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Contact } from "@/components/sections/Contact";
import { fetchAbout } from "@/lib/api/content";
import { fallbackAbout } from "@/lib/fallback";
import type { AboutSettings } from "@/lib/types";

export default function ContactPage() {
  const [about, setAbout] = useState<AboutSettings>(fallbackAbout);

  useEffect(() => {
    fetchAbout()
      .then(setAbout)
      .catch(() => setAbout(fallbackAbout));
  }, []);

  return (
    <SiteShell>
      <main>
        <div className="section-pad page-hero mx-auto max-w-7xl">
          <p className="text-xs tracking-[0.35em] text-gold uppercase">Contact</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-cream md:text-6xl">
            Let&apos;s work together
          </h1>
        </div>
        <Contact about={about} showIntro={false} />
      </main>
    </SiteShell>
  );
}
