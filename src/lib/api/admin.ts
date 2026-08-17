import { createClient } from "@/lib/supabase/client";
import type { AboutSettings, Skill } from "@/lib/types";

export type ContactMessage = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
};

export async function checkSchemaReady() {
  const supabase = createClient();
  const { error } = await supabase.from("projects").select("id").limit(1);
  if (!error) return { ready: true as const };
  const missing =
    /Could not find the table|relation .* does not exist|schema cache/i.test(
      error.message,
    );
  return { ready: false as const, missing, message: error.message };
}

export async function fetchContactMessages() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ContactMessage[];
}

export async function markMessageRead(id: string, read = true) {
  const supabase = createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ read })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteMessage(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) throw error;
}

export async function updateAbout(value: AboutSettings) {
  const supabase = createClient();
  const { error } = await supabase.from("settings").upsert(
    {
      key: "about",
      value,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );
  if (error) throw error;
}

export async function upsertSkill(
  skill: Omit<Skill, "id" | "created_at"> & { id?: string },
) {
  const supabase = createClient();
  if (skill.id) {
    const { error } = await supabase
      .from("skills")
      .update({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        order: skill.order,
      })
      .eq("id", skill.id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("skills").insert({
    name: skill.name,
    category: skill.category,
    proficiency: skill.proficiency,
    order: skill.order,
  });
  if (error) throw error;
}

export async function deleteSkill(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) throw error;
}

export async function replaceAllSkills(
  skills: Array<{
    name: string;
    category: string;
    proficiency: number;
    order: number;
  }>,
) {
  const supabase = createClient();
  const { error: delError } = await supabase
    .from("skills")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (delError) throw delError;

  const { error } = await supabase.from("skills").insert(skills);
  if (error) throw error;
}

export const SUPABASE_PROJECT = {
  name: "ThandaPortfolio",
  ref: "zvicutdibrqpflliwlvi",
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zvicutdibrqpflliwlvi.supabase.co",
  sqlEditor: "https://supabase.com/dashboard/project/zvicutdibrqpflliwlvi/sql/new",
  authUsers: "https://supabase.com/dashboard/project/zvicutdibrqpflliwlvi/auth/users",
};
