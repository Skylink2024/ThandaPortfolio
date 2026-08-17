import type { Project } from "@/lib/types";

/** Free site preview via WordPress mShots (no paid thum.io account). */
export function liveSitePreviewUrl(liveUrl: string, width = 1280) {
  const normalized = liveUrl.startsWith("http") ? liveUrl : `https://${liveUrl}`;
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(normalized)}?w=${width}`;
}

/** Prefer uploaded image; otherwise auto-preview from live_url. */
export function resolveProjectImage(
  project: Pick<Project, "image_url" | "live_url" | "title">,
) {
  if (project.image_url) return project.image_url;
  if (project.live_url) return liveSitePreviewUrl(project.live_url);
  return null;
}

export function truncate(text: string, max = 140) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
