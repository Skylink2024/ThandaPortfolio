import Image from 'next/image';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, Wrench } from 'lucide-react';
import { FinalCta } from '@/components/home/FinalCta';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { LivePreview } from '@/components/work/LivePreview';
import { industries } from '@data/builder';
import { packages } from '@data/pricing';
import { projects, type Project } from '@data/projects';
import { testimonials } from '@data/testimonials';

function industryLabel(id: Project['industry']) {
  return industries.find((i) => i.id === id)?.label ?? 'Other';
}

export function CaseStudy({ project }: { project: Project }) {
  const pkg = project.packageUsed
    ? packages.find((p) => p.id === project.packageUsed)
    : undefined;
  const testimonial = project.testimonialId
    ? testimonials.find((t) => t.id === project.testimonialId)
    : undefined;
  const idx = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <>
      <Section tone="default" className="pt-28 md:pt-36">
        <Badge tone="blue">{industryLabel(project.industry)}</Badge>
        <h1 className="text-h1 mt-4 text-gray-900">{project.name}</h1>
        <p className="text-lead mt-4 max-w-2xl text-gray-700">{project.summary}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {project.liveUrl ? (
            <Button href={project.liveUrl} variant="outline">
              Visit live site
            </Button>
          ) : null}
          <Button href={`/build?industry=${project.industry}`}>Want one like this?</Button>
        </div>

        <div className="mt-12">
          <LivePreview
            name={project.name}
            url={project.liveUrl}
            embeddable={project.embeddable}
            fallbackImages={project.screenshots}
          />
        </div>
      </Section>

      <Section tone="default">
        <div className="grid gap-6 md:grid-cols-3">
          {(
            [
              ['The problem', project.problem, AlertCircle],
              ['What I built', project.built, Wrench],
              ['The result', project.result, CheckCircle2],
            ] as const
          ).map(([title, body, Icon]) => (
            <Card key={title} className="p-6">
              <Icon className="text-blue size-6" aria-hidden="true" />
              <h2 className="text-h3 mt-4 text-gray-900">{title}</h2>
              <p className="mt-3 text-gray-700">{body}</p>
            </Card>
          ))}
        </div>

        {project.tech.length ? (
          <div className="mt-10">
            <p className="text-micro text-gray-500">Tech used</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-bg px-3 py-1.5 text-sm font-medium text-gray-700"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {pkg ? (
          <p className="mt-6 text-gray-700">
            Package used:{' '}
            <Link href="/pricing" className="text-link font-semibold hover:underline">
              {pkg.name}
            </Link>
          </p>
        ) : null}

        {testimonial ? (
          <blockquote className="mt-10 rounded-[var(--radius-lg)] border border-border bg-bg p-6">
            <p className="text-lg text-gray-900">&ldquo;{testimonial.quote}&rdquo;</p>
            <footer className="mt-4 text-sm text-gray-500">
              {testimonial.name} · {testimonial.business}
            </footer>
          </blockquote>
        ) : null}
      </Section>

      {next && next.slug !== project.slug ? (
        <Section tone="default">
          <p className="text-micro text-gray-500">Next project</p>
          <Link href={`/work/${next.slug}`} className="group mt-4 flex items-center gap-4">
            <div className="relative size-20 overflow-hidden rounded-[var(--radius-md)] border border-border">
              <Image src={next.cover} alt="" fill className="object-cover" sizes="80px" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-orange-ink">{next.name}</p>
              <p className="text-sm text-gray-500">{next.summary}</p>
            </div>
          </Link>
        </Section>
      ) : null}

      <FinalCta />
    </>
  );
}
