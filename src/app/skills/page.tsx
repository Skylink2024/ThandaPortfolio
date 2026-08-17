"use client";

import { useEffect, useState } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Skills } from "@/components/sections/Skills";
import { fetchSkills } from "@/lib/api/content";
import { fallbackSkills } from "@/lib/fallback";
import type { Skill } from "@/lib/types";

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>(fallbackSkills);

  useEffect(() => {
    fetchSkills()
      .then((data) => setSkills(data.length ? data : fallbackSkills))
      .catch(() => setSkills(fallbackSkills));
  }, []);

  return (
    <SiteShell>
      <main>
        <div className="section-pad page-hero mx-auto max-w-7xl">
          <p className="text-xs tracking-[0.35em] text-gold uppercase">Skills</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-cream md:text-6xl">
            More than code
          </h1>
          <p className="mt-4 max-w-2xl text-cream-dim">
            Web Dev, Marketing, Sales, and Business — how I build products and
            grow companies.
          </p>
        </div>
        <Skills skills={skills} showIntro={false} />
      </main>
    </SiteShell>
  );
}
