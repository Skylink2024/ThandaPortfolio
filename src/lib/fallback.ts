import { DEFAULT_SKILLS } from "@/lib/skills-data";
import type { AboutSettings, Skill } from "@/lib/types";
import { site } from "@data/site";

export const fallbackAbout: AboutSettings = {
  name: site.owner,
  email: site.email,
  location: site.location,
  phone: "",
  tagline: site.tagline,
  headline: "Website designer for Cape Town small businesses.",
  bio: site.about,
  roles: ["Website Designer", "Web Developer", "Founder, Brike Web"],
  photo_url: "",
  github_url: "https://github.com/Skylink2024",
  linkedin_url: "https://www.linkedin.com/in/thanda-manuel/",
  instagram_url: "https://www.instagram.com/thanda_manuel/",
  facebook_url: "https://facebook.com/profile.php?id=61596026195778",
};

export const fallbackSkills: Skill[] = DEFAULT_SKILLS.map((skill, index) => ({
  id: `local-${index + 1}`,
  created_at: "",
  name: skill.name,
  category: skill.category,
  proficiency: skill.proficiency,
  order: skill.order,
}));
