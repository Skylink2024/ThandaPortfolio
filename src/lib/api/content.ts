import { createClient } from "@/lib/supabase/client";
import { fallbackAbout } from "@/lib/fallback";
import type { AboutSettings, Skill } from "@/lib/types";

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
  if (!data?.value) return fallbackAbout;
  return { ...fallbackAbout, ...(data.value as Partial<AboutSettings>) };
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
