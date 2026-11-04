import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { DeviceFrame } from '@/components/ui/DeviceFrame';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { industries } from '@data/builder';
import { projects } from '@data/projects';
import type { PublicCmsProject } from '@/lib/public-content';
import { MiniSite } from './MiniSite';
import { exampleDesigns } from './exampleDesigns';

interface Tile {
  key: string;
  title: string;
  meta: string;
  description?: string;
  href: string;
  external?: boolean;
  image?: string | null;
  media?: React.ReactNode;
}

function WorkTile({ tile }: { tile: Tile }) {
  const remote = Boolean(tile.image?.startsWith('http'));
  const Wrapper = tile.external ? 'a' : Link;

  return (
    <Wrapper
      href={tile.href}
      {...(tile.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="group block"
    >
      <div className="bg-surface border-border relative aspect-[16/11] overflow-hidden rounded-[var(--radius-lg)] border">
        {tile.image ? (
          <Image
            src={tile.image}
            alt={`${tile.title} website`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            unoptimized={remote}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-6 transition-transform duration-700 ease-out group-hover:scale-[1.03] md:p-10">
            {tile.media}
          </div>
        )}
      </div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h3 className="text-h3 text-gray-900">{tile.title}</h3>
          {tile.description ? (
            <p className="mt-1 line-clamp-2 text-gray-700">{tile.description}</p>
          ) : null}
        </div>
        <span className="text-small flex shrink-0 items-center gap-1.5 text-gray-700">
          {tile.meta}
          <ArrowUpRight
            className="size-4 text-blue transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Wrapper>
  );
}

function industryLabel(id: string) {
  return industries.find((i) => i.id === id)?.label ?? 'Website';
}

export function WorkShowcase({
  cmsProjects = [],
  index,
}: {
  cmsProjects?: PublicCmsProject[];
  index?: string;
}) {
  const cmsFeatured = cmsProjects.filter((p) => p.featured);
  const cmsList = (cmsFeatured.length ? cmsFeatured : cmsProjects).slice(0, 4);
  const staticList = projects.filter((p) => p.featured && !p.placeholder).slice(0, 4);

  let tiles: Tile[];
  let isExample = false;

  if (cmsList.length) {
    tiles = cmsList.map((p) => ({
      key: p.id,
      title: p.title,
      meta: p.category || 'Website',
      description: p.description,
      href: p.live_url || '/work',
      external: Boolean(p.live_url),
      image: p.image_url,
    }));
  } else if (staticList.length) {
    tiles = staticList.map((p) => ({
      key: p.slug,
      title: p.name,
      meta: industryLabel(p.industry),
      description: p.summary,
      href: `/work/${p.slug}`,
      image: p.cover,
    }));
  } else {
    isExample = true;
    tiles = exampleDesigns.map((d) => ({
      key: d.id,
      title: d.name,
      meta: 'Example design',
      description: `${industryLabel(d.industry)} · fictional business`,
      href: `/build?industry=${d.industry}`,
      media: (
        <DeviceFrame device="desktop" className="w-full shadow-[var(--shadow-md)]">
          <MiniSite design={d} />
        </DeviceFrame>
      ),
    }));
  }

  return (
    <Section id="work" tone="default">
      <SectionHeading
        index={index}
        eyebrow={isExample ? 'Example designs' : 'Selected work'}
        title={isExample ? 'What your website could look like' : 'Recent work'}
        action={
          <Link href="/work" className="text-small link-draw font-semibold text-link">
            All work →
          </Link>
        }
      />

      <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2">
        {tiles.map((tile, i) => (
          <Reveal as="li" key={tile.key} delay={(i % 2) * 0.08}>
            <WorkTile tile={tile} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
