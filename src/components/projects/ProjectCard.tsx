"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, GitBranch, Star } from "lucide-react";
import type { Project } from "@/lib/types";
import { ProjectImage } from "@/components/projects/ProjectImage";
import { truncate } from "@/lib/utils";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.06, duration: 0.55 }}
      className="group relative flex flex-col overflow-hidden border border-gold/15 bg-gradient-to-b from-ink-soft/70 to-ink/40 transition duration-500 hover:-translate-y-1.5 hover:border-gold/45 hover:shadow-[0_30px_90px_rgba(198,161,91,0.16)]"
    >
      <Link
        href={`/projects/${project.id}`}
        className="relative block aspect-[16/10] overflow-hidden"
      >
        <ProjectImage
          project={project}
          className="h-full w-full transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80" />
        {project.featured && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-gold px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-on-gold uppercase">
            <Star size={11} /> Featured
          </span>
        )}
        <span className="absolute right-3 bottom-3 text-[10px] tracking-[0.18em] text-cream/80 uppercase">
          {project.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-[family-name:var(--font-display)] text-2xl text-cream">
          <Link href={`/projects/${project.id}`} className="hover:text-gold">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-cream-dim">
          {truncate(project.description, 160)}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech_stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="border border-gold/20 px-2 py-0.5 text-[10px] tracking-wide text-gold"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row sm:gap-3">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 bg-gold px-3 py-3 text-xs font-semibold tracking-[0.14em] text-on-gold uppercase transition hover:bg-gold-bright sm:py-2.5"
            >
              View Project <ExternalLink size={14} />
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-gold/35 px-3 py-3 text-xs tracking-[0.14em] text-gold uppercase transition hover:bg-gold/10 sm:py-2.5"
            >
              <GitBranch size={14} /> GitHub
            </a>
          )}
          {!project.live_url && !project.github_url && (
            <Link
              href={`/projects/${project.id}`}
              className="inline-flex flex-1 items-center justify-center border border-gold/35 px-3 py-3 text-xs tracking-[0.14em] text-gold uppercase sm:py-2.5"
            >
              Details
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}
