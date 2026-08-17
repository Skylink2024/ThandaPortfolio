import { createClient } from "@/lib/supabase/client";
import type { AboutSettings, Skill } from "@/lib/types";

const defaultAbout: AboutSettings = {
  name: "Thanda Manuel",
  email: "Brikemanuel@gmail.com",
  location: "Cape Town, South Africa",
  phone: "+27 671280592",
  tagline: "Purpose · Disciple · Legacy",
  headline: "Full-stack developer who ships production products.",
  bio: "Full-stack developer with 7+ live production applications built using TypeScript and modern JavaScript frameworks, combined with 4+ years of B2B sales, partnership development, and digital marketing experience.",
  roles: ["Full-Stack Developer", "Digital Marketing Specialist", "Product Builder"],
  photo_url: "",
  github_url: "https://github.com/Skylink2024",
};

export async function fetchSkills() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Skill[];
}

export async function fetchAbout() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "about")
    .maybeSingle();

  if (error) throw error;
  if (!data?.value) return defaultAbout;
  return { ...defaultAbout, ...(data.value as AboutSettings) };
}

export async function submitContact(payload: {
  name: string;
  email: string;
  message: string;
}) {
  const supabase = createClient();
  const { error } = await supabase.from("contact_messages").insert(payload);
  if (error) throw error;
}
