import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudy } from '@/components/work/CaseStudy';
import { getVisibleProjects, projects } from '@data/projects';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: 'Project' };
  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
  };
}

export default async function WorkSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const visible = getVisibleProjects();
  const project = visible.find((p) => p.slug === slug) ?? projects.find((p) => p.slug === slug);

  // Hide placeholder-only projects in production unless SHOW_PLACEHOLDERS.
  if (!project || (project.placeholder && !visible.some((p) => p.slug === slug))) {
    notFound();
  }

  return <CaseStudy project={project} />;
}
