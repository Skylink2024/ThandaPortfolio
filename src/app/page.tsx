"use client";

import { useEffect, useState } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Hero } from "@/components/sections/Hero";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { fetchAbout } from "@/lib/api/content";
import { fetchProjects } from "@/lib/api/projects";
import { fallbackAbout } from "@/lib/fallback";
import type { Project } from "@/lib/types";

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [githubUrl, setGithubUrl] = useState(fallbackAbout.github_url);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [data, about] = await Promise.all([
          fetchProjects().catch(() => [] as Project[]),
          fetchAbout().catch(() => fallbackAbout),
        ]);
        if (!alive) return;
        setProjects(data);
        setGithubUrl(about.github_url || fallbackAbout.github_url);
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
        <Hero githubUrl={githubUrl} />
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
