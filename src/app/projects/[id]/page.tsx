"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, GitBranch } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { ProjectImage } from "@/components/projects/ProjectImage";
import { fetchProjectById } from "@/lib/api/projects";
import type { Project } from "@/lib/types";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    let alive = true;
    (async () => {
      try {
        const data = await fetchProjectById(params.id);
        if (alive) setProject(data);
      } catch {
        if (alive) setError("Project not found.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [params.id]);

  return (
    <SiteShell>
      <article className="section-pad mx-auto max-w-5xl pt-28 pb-20 md:pt-32">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-gold uppercase"
        >
          <ArrowLeft size={14} /> Back to work
        </Link>

        {loading && (
          <div className="mt-10 space-y-4">
            <div className="skeleton aspect-[16/9] w-full" />
            <div className="skeleton h-10 w-1/2" />
            <div className="skeleton h-24 w-full" />
          </div>
        )}

        {error && (
          <p className="mt-12 border border-gold/20 p-8 text-cream-dim">{error}</p>
        )}

        {project && (
          <>
            <div className="mt-8 overflow-hidden border border-gold/20">
              <ProjectImage
                project={project}
                className="aspect-[16/9] w-full"
                imgClassName="aspect-[16/9] w-full object-cover"
              />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {project.featured && (
                <span className="bg-gold px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-on-gold uppercase">
                  Featured
                </span>
              )}
              <span className="border border-gold/25 px-2.5 py-1 text-[10px] tracking-[0.16em] text-gold uppercase">
                {project.category}
              </span>
            </div>

            <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-cream md:text-6xl">
              {project.title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-cream-dim md:text-lg">
              {project.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className="border border-gold/25 px-3 py-1 text-xs text-gold"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gold px-6 py-3 text-xs font-semibold tracking-[0.18em] text-on-gold uppercase"
                >
                  Open live site <ExternalLink size={14} />
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-gold/40 px-6 py-3 text-xs tracking-[0.18em] text-gold uppercase"
                >
                  <GitBranch size={14} /> GitHub
                </a>
              )}
            </div>
          </>
        )}
      </article>
    </SiteShell>
  );
}
