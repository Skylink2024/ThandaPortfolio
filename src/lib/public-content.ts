import { createClient } from '@/lib/supabase/server';
import { fallbackAbout } from '@/lib/fallback';
import type { AboutSettings, Project } from '@/lib/types';
import type { SocialLink } from '@data/site';
import { site } from '@data/site';
import { resolveProjectImage } from '@/lib/utils';

export type PublicCmsProject = {
  id: string;
  title: string;
  description: string;
  live_url: string | null;
  image_url: string | null;
  featured: boolean;
  category: string;
};

/** About + socials for the public site. Falls back cleanly if Supabase is down. */
export async function getPublicAbout(): Promise<AboutSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'about')
      .maybeSingle();
    if (error || !data?.value) return fallbackAbout;
    return { ...fallbackAbout, ...(data.value as Partial<AboutSettings>) };
  } catch {
    return fallbackAbout;
  }
}

/** Live client projects from admin. Empty array if none / offline. */
export async function getPublicCmsProjects(): Promise<PublicCmsProject[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('id, title, description, live_url, image_url, featured, category, order')
      .order('featured', { ascending: false })
      .order('order', { ascending: true });
    if (error || !data) return [];
    return (data as Project[])
      .filter((p) => Boolean(p.live_url || p.image_url))
      .map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        live_url: p.live_url,
        image_url: resolveProjectImage(p),
        featured: p.featured,
        category: p.category,
      }));
  } catch {
    return [];
  }
}

export function socialsFromAbout(about: AboutSettings): SocialLink[] {
  const fromCms: SocialLink[] = [];
  if (about.instagram_url?.trim()) {
    fromCms.push({ label: 'Instagram', href: about.instagram_url.trim() });
  }
  if (about.linkedin_url?.trim()) {
    fromCms.push({ label: 'LinkedIn', href: about.linkedin_url.trim() });
  }
  if (about.facebook_url?.trim()) {
    fromCms.push({ label: 'Facebook', href: about.facebook_url.trim() });
  }
  return fromCms.length ? fromCms : site.socials.filter((s) => !s.placeholder);
}

export function portraitSrc(about: AboutSettings): string {
  return about.photo_url?.trim() || '/thanda.jpg';
}
