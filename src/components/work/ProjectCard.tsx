'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { industries } from '@data/builder';
import type { Project } from '@data/projects';

function industryLabel(id: Project['industry']) {
  return industries.find((i) => i.id === id)?.label ?? 'Other';
}

export interface WorkCardProps {
  href: string;
  title: string;
  meta: string;
  description?: string;
  image?: string | null;
  external?: boolean;
  priority?: boolean;
  badge?: string;
}

/** Image-led portfolio tile shared by /work and case-study links. */
export function WorkCard({
  href,
  title,
  meta,
  description,
  image,
  external,
  priority,
  badge,
}: WorkCardProps) {
  const remote = Boolean(image?.startsWith('http'));
  const content = (
    <>
      <div className="bg-surface border-border relative aspect-[16/11] overflow-hidden rounded-[var(--radius-lg)] border">
        {image ? (
          <Image
            src={image}
            alt={`${title} website`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            priority={priority}
            unoptimized={remote}
          />
        ) : null}
        {badge ? (
          <span className="text-micro bg-bg/90 absolute top-3 left-3 rounded-full border border-dashed border-gray-300 px-2.5 py-1 text-gray-700">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-h3 text-gray-900">{title}</h2>
          {description ? <p className="mt-1 line-clamp-2 text-gray-700">{description}</p> : null}
        </div>
        <span className="text-small flex shrink-0 items-center gap-1.5 text-gray-700">
          {meta}
          <ArrowUpRight
            className="size-4 text-blue transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </>
  );

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group block">
      {content}
    </a>
  ) : (
    <Link href={href} className="group block">
      {content}
    </Link>
  );
}

export function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <WorkCard
        href={`/work/${project.slug}`}
        title={project.name}
        meta={industryLabel(project.industry)}
        description={project.summary}
        image={project.cover}
        priority={priority}
        badge={project.placeholder ? 'Placeholder' : undefined}
      />
    </motion.div>
  );
}
