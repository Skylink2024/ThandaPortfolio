import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BeforeAfter } from '@/components/home/BeforeAfter';
import { FinalCta } from '@/components/home/FinalCta';
import { PageHeader } from '@/components/ui/PageHeader';
import { WorkPageClient } from '@/components/work/WorkPageClient';
import { getPublicCmsProjects } from '@/lib/public-content';

export const metadata: Metadata = {
  title: 'My work',
  description:
    'Websites built by Brike Web for Cape Town small businesses — designed to look great, load fast and bring in customers.',
  alternates: { canonical: '/work' },
};

export default async function WorkPage() {
  const cmsProjects = await getPublicCmsProjects();

  return (
    <>
      <PageHeader
        eyebrow="Work"
        title="My work"
        subtitle="Websites built to look great, load fast and bring in customers."
      />
      <Suspense fallback={<div className="container-brike py-20 text-gray-500">Loading work…</div>}>
        <WorkPageClient cmsProjects={cmsProjects} />
      </Suspense>
      <BeforeAfter />
      <FinalCta />
    </>
  );
}
