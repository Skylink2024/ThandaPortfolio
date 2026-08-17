"use client";

import { useEffect, useState } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { fetchProjects } from "@/lib/api/projects";
import type { Project } from "@/lib/types";

export default function WorkPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchProjects().catch(() => [] as Project[]);
        if (alive) setProjects(data);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <SiteShell>
      <main>
        <div className="section-pad page-hero mx-auto max-w-7xl">
          <p className="text-xs tracking-[0.35em] text-gold uppercase">Work</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-cream md:text-6xl">
            All projects
          </h1>
          <p className="mt-4 max-w-2xl text-cream-dim">
            Filter by category, open live sites, and read the full story behind
            each build.
          </p>
        </div>
        <ProjectGrid
          projects={projects}
          loading={loading}
          eyebrow="Portfolio"
          title="Production applications"
          subtitle="From review platforms to B2B portals and business websites."
          compactHeader
        />
      </main>
    </SiteShell>
  );
}
