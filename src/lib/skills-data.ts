export const SKILL_CATEGORIES = [
  "Web Dev",
  "Marketing",
  "Sales",
  "Business",
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

/** Full portfolio skills — tech + business, sales, and growth. */
export const DEFAULT_SKILLS: Array<{
  name: string;
  category: SkillCategory;
  proficiency: number;
  order: number;
}> = [
  // Web Dev
  { name: "TypeScript", category: "Web Dev", proficiency: 95, order: 1 },
  { name: "JavaScript (ES6+)", category: "Web Dev", proficiency: 95, order: 2 },
  { name: "React / Next.js", category: "Web Dev", proficiency: 92, order: 3 },
  { name: "React Native", category: "Web Dev", proficiency: 85, order: 4 },
  { name: "Node.js", category: "Web Dev", proficiency: 88, order: 5 },
  { name: "HTML5 / CSS3", category: "Web Dev", proficiency: 95, order: 6 },
  { name: "PostgreSQL", category: "Web Dev", proficiency: 95, order: 7 },
  { name: "REST APIs & Auth", category: "Web Dev", proficiency: 92, order: 8 },
  { name: "Git / GitHub", category: "Web Dev", proficiency: 92, order: 9 },
  { name: "Vercel", category: "Web Dev", proficiency: 90, order: 10 },
  { name: "Render", category: "Web Dev", proficiency: 92, order: 11 },
  { name: "Hostinger", category: "Web Dev", proficiency: 90, order: 12 },
  { name: "Cloudflare", category: "Web Dev", proficiency: 86, order: 13 },
  { name: "Cursor AI / AI-Assisted Development", category: "Web Dev", proficiency: 95, order: 14 },
  { name: "No-Code / Low-Code Solutions", category: "Web Dev", proficiency: 88, order: 15 },

  // Marketing
  { name: "Brand Development", category: "Marketing", proficiency: 91, order: 20 },
  { name: "Business Positioning", category: "Marketing", proficiency: 91, order: 21 },
  { name: "Personal Branding", category: "Marketing", proficiency: 90, order: 22 },
  { name: "Marketing Collateral", category: "Marketing", proficiency: 92, order: 23 },
  { name: "Canva Design", category: "Marketing", proficiency: 90, order: 24 },
  { name: "SEO Optimization", category: "Marketing", proficiency: 88, order: 25 },
  { name: "Google Ads", category: "Marketing", proficiency: 82, order: 26 },
  { name: "Digital Business Development", category: "Marketing", proficiency: 90, order: 27 },

  // Sales
  { name: "B2B Sales", category: "Sales", proficiency: 96, order: 30 },
  { name: "Outbound Sales", category: "Sales", proficiency: 97, order: 31 },
  { name: "Lead Generation", category: "Sales", proficiency: 96, order: 32 },
  { name: "Sales Process Development", category: "Sales", proficiency: 94, order: 33 },
  { name: "Sales Team Coaching", category: "Sales", proficiency: 95, order: 34 },
  { name: "Sales Performance Optimization", category: "Sales", proficiency: 94, order: 35 },
  { name: "Client Acquisition", category: "Sales", proficiency: 94, order: 36 },
  { name: "SDR Team Leadership", category: "Sales", proficiency: 94, order: 37 },
  { name: "Call Auditing", category: "Sales", proficiency: 96, order: 38 },
  { name: "KPI Management", category: "Sales", proficiency: 94, order: 39 },
  { name: "Performance Coaching", category: "Sales", proficiency: 95, order: 40 },
  { name: "Sales Training", category: "Sales", proficiency: 93, order: 41 },
  { name: "PIP Development", category: "Sales", proficiency: 91, order: 42 },
  { name: "Prospect Research", category: "Sales", proficiency: 96, order: 43 },

  // Business
  { name: "Business Building", category: "Business", proficiency: 95, order: 50 },
  { name: "Business Development", category: "Business", proficiency: 95, order: 51 },
  { name: "Business Model Development", category: "Business", proficiency: 93, order: 52 },
  { name: "Business Strategy", category: "Business", proficiency: 92, order: 53 },
  { name: "Market Expansion", category: "Business", proficiency: 90, order: 54 },
  { name: "Revenue Strategy", category: "Business", proficiency: 91, order: 55 },
  { name: "BPO Business Development", category: "Business", proficiency: 95, order: 56 },
  { name: "BPO Operations", category: "Business", proficiency: 91, order: 57 },
  { name: "Outsourcing Strategy", category: "Business", proficiency: 93, order: 58 },
  { name: "Workforce Planning", category: "Business", proficiency: 89, order: 59 },
  { name: "Service Pricing & Commercial Modeling", category: "Business", proficiency: 92, order: 60 },
  { name: "ICP Development", category: "Business", proficiency: 94, order: 61 },
  { name: "Market Research", category: "Business", proficiency: 93, order: 62 },
  { name: "Competitor Research", category: "Business", proficiency: 90, order: 63 },
  { name: "Sales Market Analysis", category: "Business", proficiency: 92, order: 64 },
  { name: "Opportunity Identification", category: "Business", proficiency: 95, order: 65 },
  { name: "AI-Assisted Business Research", category: "Business", proficiency: 94, order: 66 },
  { name: "AI Productivity", category: "Business", proficiency: 92, order: 67 },
  { name: "AI Workflow Optimization", category: "Business", proficiency: 89, order: 68 },
  { name: "CRM Strategy", category: "Business", proficiency: 91, order: 69 },
];
