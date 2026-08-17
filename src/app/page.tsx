"use client";

import { useEffect, useState } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Hero } from "@/components/sections/Hero";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { fetchProjects } from "@/lib/api/projects";
import type { Project } from "@/lib/types";

export default function HomePage() {
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
        <Hero />
        <ProjectGrid
          id="work"
          projects={projects}
          loading={loading}
          eyebrow="Featured on the homepage"
          title="Selected work"
          subtitle="Live production applications — explore details, open the live site, or visit the full Work page."
          showViewAll
        />
      </main>
    </SiteShell>
  );
}
