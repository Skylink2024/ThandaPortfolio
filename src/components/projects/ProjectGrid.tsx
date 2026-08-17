"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/types";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectSkeleton } from "@/components/ui/Skeleton";

const ALL = "All";

export function ProjectGrid({
  projects,
  loading,
  id,
  eyebrow = "Portfolio",
  title = "Selected work",
  subtitle,
  showViewAll = false,
  compactHeader = false,
}: {
  projects: Project[];
  loading?: boolean;
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  compactHeader?: boolean;
}) {
  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return [ALL, ...Array.from(set).sort()];
  }, [projects]);

  const [category, setCategory] = useState(ALL);
  const [sort, setSort] = useState<"featured" | "order" | "title">("featured");

  const filtered = useMemo(() => {
    const list =
      category === ALL
        ? [...projects]
        : projects.filter((p) => p.category === category);

    list.sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "order") return a.order - b.order;
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.order - b.order;
    });

    return list;
  }, [projects, category, sort]);

  const filters = (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border border-gold/25 bg-ink-soft px-3 py-2 text-xs tracking-wide text-cream outline-none"
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        value={sort}
        onChange={(e) =>
          setSort(e.target.value as "featured" | "order" | "title")
        }
        className="border border-gold/25 bg-ink-soft px-3 py-2 text-xs tracking-wide text-cream outline-none"
      >
        <option value="featured">Featured first</option>
        <option value="order">Manual order</option>
        <option value="title">Title A–Z</option>
      </select>
    </div>
  );

  return (
    <section
      id={id}
      className={`section-pad ${compactHeader ? "pb-28 pt-6 md:pb-36" : "py-28 md:py-36"}`}
    >
      <div className="mx-auto max-w-7xl">
        {compactHeader ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs tracking-[0.2em] text-cream-dim uppercase">
              Filter & sort
            </p>
            {filters}
          </div>
        ) : (
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs tracking-[0.35em] text-gold uppercase">
                {eyebrow}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-cream md:text-6xl">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-3 max-w-xl text-cream-dim">{subtitle}</p>
              )}
              {showViewAll && (
                <Link
                  href="/work"
                  className="mt-4 inline-flex text-xs tracking-[0.2em] text-gold uppercase transition hover:text-gold-bright"
                >
                  View all work →
                </Link>
              )}
            </div>
            {filters}
          </div>
        )}

        <div className="mt-12">
          {loading ? (
            <ProjectSkeleton />
          ) : filtered.length === 0 ? (
            <p className="border border-gold/20 p-10 text-center text-cream-dim">
              Selected work will appear here soon.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
