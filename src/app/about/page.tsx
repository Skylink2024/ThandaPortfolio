"use client";

import { useEffect, useState } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { About } from "@/components/sections/About";
import { fetchAbout } from "@/lib/api/content";
import { fallbackAbout } from "@/lib/fallback";
import type { AboutSettings } from "@/lib/types";

export default function AboutPage() {
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
          <p className="text-xs tracking-[0.35em] text-gold uppercase">About Us</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-cream md:text-6xl">
            Who I am
          </h1>
        </div>
        <About about={about} showIntro={false} />
      </main>
    </SiteShell>
  );
}
