import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { z } from 'zod';
import type { Extra, PackageId } from '@data/pricing';
import type { FeatureId, FontPairId, PageId, PresetId } from '@data/builder';
import type { Industry } from '@data/projects';

const industrySchema = z.enum([
  'salon',
  'barber',
  'restaurant',
  'tourism',
  'cleaning',
  'construction',
  'retail',
  'professional',
  'other',
]);

const pageSchema = z.enum([
  'home',
  'about',
  'services',
  'gallery',
  'menu',
  'bookings',
  'shop',
  'blog',
  'contact',
]);

const featureSchema = z.enum([
  'whatsapp',
  'contactForm',
  'maps',
  'booking',
  'payments',
  'shop',
  'blog',
  'multilingual',
]);

const presetSchema = z.enum(['modern', 'luxury', 'bold', 'minimal', 'playful', 'corporate']);
const fontSchema = z.enum([
  'modern',
  'luxury',
  'bold',
  'minimal',
  'playful',
  'corporate',
  'space-grotesk',
  'poppins',
]);
const packageSchema = z.enum(['starter', 'business', 'google', 'editor', 'shop']);
const extraSchema = z.enum([
  'domain',
  'hostingBasic',
  'hostingBusiness',
  'care',
  'extraChanges',
  'gbpSetup',
  'gbpCare',
  'seoOnce',
  'localSeo',
  'googleStarter',
  'extraPage',
]);

export const sharedDesignSchema = z.object({
  v: z.literal(1),
  b: z.object({
    name: z.string().max(40),
    industry: industrySchema,
    tagline: z.string().max(70),
    location: z.string().max(60),
  }),
  s: z.object({
    presetId: presetSchema,
    primary: z.string().max(20),
    accent: z.string().max(20),
    fontPairId: fontSchema,
  }),
  p: z.array(pageSchema).min(1).max(12),
  f: z.array(featureSchema).max(12),
  e: z.array(extraSchema).max(20),
  k: packageSchema.optional(),
});

export type SharedDesign = {
  v: 1;
  b: { name: string; industry: Industry; tagline: string; location: string };
  s: { presetId: PresetId; primary: string; accent: string; fontPairId: FontPairId };
  p: PageId[];
  f: FeatureId[];
  e: Extra['id'][];
  k?: PackageId;
};

export function encodeDesign(d: SharedDesign): string {
  return compressToEncodedURIComponent(JSON.stringify(d));
}

export function decodeDesign(code: string): SharedDesign | null {
  try {
    const raw = decompressFromEncodedURIComponent(code);
    if (!raw) return null;
    const parsed = sharedDesignSchema.safeParse(JSON.parse(raw));
    return parsed.success ? (parsed.data as SharedDesign) : null;
  } catch {
    return null;
  }
}
