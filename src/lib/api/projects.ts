import { createClient } from "@/lib/supabase/client";
import type { Project, ProjectFormData } from "@/lib/types";

function parseTechStack(value: string) {
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export async function fetchProjects() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("featured", { ascending: false })
    .order("order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Project[];
}

export async function fetchProjectById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Project;
}

export async function createProject(form: ProjectFormData) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      title: form.title,
      description: form.description,
      tech_stack: parseTechStack(form.tech_stack),
      live_url: form.live_url || null,
      github_url: form.github_url || null,
      image_url: form.image_url || null,
      featured: form.featured,
      order: form.order,
      category: form.category,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Project;
}

export async function updateProject(id: string, form: ProjectFormData) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .update({
      title: form.title,
      description: form.description,
      tech_stack: parseTechStack(form.tech_stack),
      live_url: form.live_url || null,
      github_url: form.github_url || null,
      image_url: form.image_url || null,
      featured: form.featured,
      order: form.order,
      category: form.category,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Project;
}

export async function deleteProject(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleFeatured(id: string, featured: boolean) {
  const supabase = createClient();
  const { error } = await supabase
    .from("projects")
    .update({ featured })
    .eq("id", id);
  if (error) throw error;
}

export async function updateProjectOrder(id: string, order: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from("projects")
    .update({ order })
    .eq("id", id);
  if (error) throw error;
}

export async function uploadProjectImage(file: File) {
  return uploadPortfolioImage(file, "projects");
}

export async function uploadProfileImage(file: File) {
  return uploadPortfolioImage(file, "profile");
}

async function uploadPortfolioImage(file: File, folder: string) {
  const supabase = createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("portfolio-images")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("portfolio-images").getPublicUrl(path);

  return { path, publicUrl };
}
