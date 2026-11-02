import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DeviceFrame } from '@/components/ui/DeviceFrame';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { industries } from '@data/builder';
import { projects, type Project } from '@data/projects';
import { MiniSite } from './MiniSite';
import { exampleDesigns } from './exampleDesigns';

function industryLabel(id: Project['industry']) {
  return industries.find((i) => i.id === id)?.label ?? 'Other';
}

function FeaturedProject({ project }: { project: Project }) {
  return (
    <Card interactive padded={false} className="overflow-hidden">
      <Link href={`/work/${project.slug}`} className="block">
        <div className="bg-surface-2 relative aspect-[16/10]">
          <Image
            src={project.cover}
            alt={`${project.name} website`}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <Badge tone="blue">{industryLabel(project.industry)}</Badge>
          <h3 className="text-h3 mt-3 text-gray-900">{project.name}</h3>
          <p className="mt-2 text-gray-500">{project.result}</p>
          <span className="text-blue mt-4 inline-block font-semibold">View case study →</span>
        </div>
      </Link>
    </Card>
  );
}

function ExampleDesigns() {
  return (
    <>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {exampleDesigns.map((design, i) => (
          <li key={design.id}>
            <Reveal delay={i * 0.06}>
              <Card padded={false} className="overflow-hidden p-4">
                <DeviceFrame device="desktop" className="rounded-[var(--radius-md)]">
                  <MiniSite design={design} />
                </DeviceFrame>
                <div className="mt-4 flex items-center justify-between gap-2 px-1 pb-1">
                  <span className="font-semibold text-gray-900">{design.name}</span>
                  <Badge tone="neutral">Example design</Badge>
                </div>
              </Card>
            </Reveal>
          </li>
        ))}
      </ul>
      <div className="mt-10 text-center">
        <Button href="/build" size="lg">
          Design yours
        </Button>
      </div>
    </>
  );
}

export function WorkShowcase() {
  // Real, non-placeholder featured projects only.
  const featured = projects.filter((p) => p.featured && !p.placeholder).slice(0, 3);
  const hasReal = featured.length > 0;

  return (
    <Section id="work" tone="default">
      {hasReal ? (
        <SectionHeading title="Recent work" subtitle="Real projects. Real businesses." />
      ) : (
        <SectionHeading
          eyebrow="Example designs"
          title="Recent work"
          subtitle="My first client case studies are on the way. Meanwhile, see what your site could look like."
        />
      )}

      {hasReal ? (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <li key={project.slug}>
              <FeaturedProject project={project} />
            </li>
          ))}
        </ul>
      ) : (
        <ExampleDesigns />
      )}

      <p className="mt-8 text-center">
        <Link href="/work" className="text-blue font-semibold underline-offset-4 hover:underline">
          See all work →
        </Link>
      </p>
    </Section>
  );
}
