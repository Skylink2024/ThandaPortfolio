import { industries, stylePresets, type PresetId } from '@data/builder';
import type { Industry } from '@data/projects';

/**
 * Fictional demo businesses used on the homepage.
 * Clearly labelled "Example design" wherever they appear.
 * TODO(Phase 5): swap MiniSite for the real builder preview components.
 */
export interface ExampleDesign {
  id: string;
  name: string;
  industry: Industry;
  preset: PresetId;
  location: string;
}

export const exampleDesigns: ExampleDesign[] = [
  {
    id: 'ocean-fade',
    name: 'Ocean Fade Barbers',
    industry: 'barber',
    preset: 'bold',
    location: 'Cape Town',
  },
  {
    id: 'lerato-kitchen',
    name: "Lerato's Kitchen",
    industry: 'restaurant',
    preset: 'playful',
    location: 'Cape Town',
  },
  {
    id: 'atlantic-tours',
    name: 'Atlantic Tours',
    industry: 'tourism',
    preset: 'luxury',
    location: 'Cape Town',
  },
  {
    id: 'sparkle-clean',
    name: 'Sparkle Clean Co.',
    industry: 'cleaning',
    preset: 'modern',
    location: 'Cape Town',
  },
];

export function getPreset(id: PresetId) {
  return stylePresets.find((p) => p.id === id) ?? stylePresets[0]!;
}

export function getIndustry(id: Industry) {
  return industries.find((i) => i.id === id) ?? industries[0]!;
}

export function designContent(design: ExampleDesign) {
  const industry = getIndustry(design.industry);
  const headline = industry.heroHeadline
    .replace('{name}', design.name)
    .replace('{location}', design.location);
  return {
    headline,
    tagline: industry.suggestedTaglines[0] ?? '',
    services: industry.services.map((s) => s.name),
  };
}
