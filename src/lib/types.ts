export type Project = {
  id: string;
  created_at: string;
  title: string;
  description: string;
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
  image_url: string | null;
  image_file: string | null;
  featured: boolean;
  order: number;
  category: string;
};

export type Skill = {
  id: string;
  created_at: string;
  name: string;
  category: string;
  proficiency: number;
  order: number;
};

export type AboutSettings = {
  name: string;
  email: string;
  location: string;
  phone: string;
  tagline: string;
  headline: string;
  bio: string;
  roles: string[];
  photo_url: string;
  github_url: string;
};

export type ProjectFormData = {
  title: string;
  description: string;
  tech_stack: string;
  live_url: string;
  github_url: string;
  image_url: string;
  featured: boolean;
  order: number;
  category: string;
};

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};
