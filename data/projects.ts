import type { PackageId } from './pricing';

export type Industry =
  | 'salon'
  | 'barber'
  | 'restaurant'
  | 'tourism'
  | 'cleaning'
  | 'construction'
  | 'retail'
  | 'professional'
  | 'other';

export interface Project {
  slug: string;
  name: string;
  industry: Industry;
  liveUrl?: string;
  embeddable: boolean;
  cover: string;
  screenshots: { src: string; alt: string; device: 'desktop' | 'phone' }[];
  scrollPreview?: string;
  year: number;
  featured: boolean;
  placeholder: boolean;
  summary: string;
  problem: string;
  built: string;
  result: string;
  tech: string[];
  packageUsed?: PackageId;
  testimonialId?: string;
}

export const projects: Project[] = [
  {
    slug: 'fahari-vida',
    name: 'Fahari Vida',
    industry: 'tourism',
    embeddable: false,
    cover: '/work/fahari-vida/cover.svg',
    screenshots: [],
    year: 2025,
    featured: true,
    placeholder: true,
    summary: 'A tour company website with packages, itineraries and prices.',
    // TODO(Thanda): add live URL, screenshots and the real story
    problem: '[[PLACEHOLDER: What problem did Fahari Vida need solved?]]',
    built: '[[PLACEHOLDER: What was built for Fahari Vida?]]',
    result: '[[PLACEHOLDER: Real, verifiable result only — no invented numbers]]',
    tech: ['Next.js', 'Tailwind CSS'],
    packageUsed: 'business',
  },
  {
    slug: 'placeholder-project-two',
    // TODO(Thanda): replace with a real project
    name: '[[PLACEHOLDER: Project name]]',
    industry: 'other',
    embeddable: false,
    cover: '/work/placeholder-two.svg',
    screenshots: [],
    year: 2025,
    featured: false,
    placeholder: true,
    summary: '[[PLACEHOLDER: One-line project summary]]',
    problem: '[[PLACEHOLDER: Problem]]',
    built: '[[PLACEHOLDER: What was built]]',
    result: '[[PLACEHOLDER: Real result only]]',
    tech: [],
  },
  {
    slug: 'placeholder-project-three',
    // TODO(Thanda): replace with a real project
    name: '[[PLACEHOLDER: Project name]]',
    industry: 'other',
    embeddable: false,
    cover: '/work/placeholder-three.svg',
    screenshots: [],
    year: 2025,
    featured: false,
    placeholder: true,
    summary: '[[PLACEHOLDER: One-line project summary]]',
    problem: '[[PLACEHOLDER: Problem]]',
    built: '[[PLACEHOLDER: What was built]]',
    result: '[[PLACEHOLDER: Real result only]]',
    tech: [],
  },
];

export function getVisibleProjects(): Project[] {
  const showPlaceholders =
    process.env.NODE_ENV !== 'production' || process.env.SHOW_PLACEHOLDERS === 'true';
  return projects.filter((p) => showPlaceholders || !p.placeholder);
}
