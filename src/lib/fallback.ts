import { DEFAULT_SKILLS } from "@/lib/skills-data";
import type { Skill } from "@/lib/types";

export const fallbackAbout = {
  name: "Thanda Manuel",
  email: "Brikemanuel@gmail.com",
  location: "Cape Town, South Africa",
  phone: "+27 671280592",
  tagline: "Purpose · Disciple · Legacy",
  headline: "Full-stack developer who ships production products.",
  bio: "Full-stack developer with 7+ live production applications built using TypeScript and modern JavaScript frameworks, combined with 4+ years of B2B sales, partnership development, and digital marketing experience. Built and deployed review platforms, a B2B procurement portal, business websites, and a custom CRM — with authentication, API integrations, and SEO optimization. Ships fast, works independently, and translates business problems into technical solutions. Fluent in English, Portuguese, and Spanish.",
  roles: [
    "Full-Stack Developer",
    "Digital Marketing Specialist",
    "Product Builder",
  ],
  photo_url: "",
  github_url: "https://github.com/Skylink2024",
};

export const fallbackSkills: Skill[] = DEFAULT_SKILLS.map((skill, index) => ({
  id: `local-${index + 1}`,
  created_at: "",
  name: skill.name,
  category: skill.category,
  proficiency: skill.proficiency,
  order: skill.order,
}));
