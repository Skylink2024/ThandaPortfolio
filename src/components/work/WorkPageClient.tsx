'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { DeviceFrame } from '@/components/ui/DeviceFrame';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { ProjectCard, WorkCard } from '@/components/work/ProjectCard';
import { ProjectFilter } from '@/components/work/ProjectFilter';
import { exampleDesigns } from '@/components/home/exampleDesigns';
import { MiniSite } from '@/components/home/MiniSite';
import { industries } from '@data/builder';
import { getVisibleProjects, type Industry } from '@data/projects';
import type { PublicCmsProject } from '@/lib/public-content';

export function WorkPageClient({ cmsProjects = [] }: { cmsProjects?: PublicCmsProject[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeParam = searchParams.get('industry');
  const staticProjects = getVisibleProjects();
  const hasCms = cmsProjects.length > 0;

  const available = useMemo(
    () => Array.from(new Set(staticProjects.map((p) => p.industry))),
    [staticProjects],
  );

  const active: Industry | 'all' =
    activeParam && available.includes(activeParam as Industry)
      ? (activeParam as Industry)
      : 'all';

  const filtered =
    active === 'all' ? staticProjects : staticProjects.filter((p) => p.industry === active);

  function setIndustry(next: Industry | 'all') {
    const params = new URLSearchParams(searchParams.toString());
    if (next === 'all') params.delete('industry');
    else params.set('industry', next);
    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }

  const showExamples = !hasCms && staticProjects.length === 0;

  return (
    <Section tone="default">
      {hasCms ? (
        <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2">
          {cmsProjects.map((p, i) => (
            <Reveal as="li" key={p.id} delay={(i % 2) * 0.08}>
              <WorkCard
                href={p.live_url || '#'}
                external={Boolean(p.live_url)}
                title={p.title}
                meta={p.category || 'Website'}
                description={p.description}
                image={p.image_url}
                priority={i < 2}
              />
            </Reveal>
          ))}
        </ul>
      ) : showExamples ? (
        <>
          <p className="mb-12 max-w-2xl text-gray-700">
            Client case studies are on the way. Meanwhile, here are example designs of what your
            website could look like.
          </p>
          <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2">
            {exampleDesigns.map((design, i) => (
              <Reveal as="li" key={design.id} delay={(i % 2) * 0.08}>
                <a href={`/build?industry=${design.industry}`} className="group block">
                  <div className="bg-surface border-border flex aspect-[16/11] items-center justify-center overflow-hidden rounded-[var(--radius-lg)] border p-6 md:p-10">
                    <DeviceFrame
                      device="desktop"
                      className="w-full shadow-[var(--shadow-md)] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    >
                      <MiniSite design={design} />
                    </DeviceFrame>
                  </div>
                  <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                      <h2 className="text-h3 text-gray-900">{design.name}</h2>
                      <p className="mt-1 text-gray-700">
                        {industries.find((x) => x.id === design.industry)?.label} · fictional
                        business
                      </p>
                    </div>
                    <span className="text-small text-gray-700">Example design</span>
                  </div>
                </a>
              </Reveal>
            ))}
          </ul>
          <div className="mt-16">
            <Button href="/build" size="lg" variant="secondary">
              Design yours
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-12">
            <ProjectFilter available={available} active={active} onChange={setIndustry} />
          </div>
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <ProjectCard key={project.slug} project={project} priority={i < 2} />
              ))}
            </AnimatePresence>
          </div>
          {filtered.length === 0 ? (
            <p className="mt-10 text-gray-700">No projects in that industry yet.</p>
          ) : null}
        </>
      )}
    </Section>
  );
}
