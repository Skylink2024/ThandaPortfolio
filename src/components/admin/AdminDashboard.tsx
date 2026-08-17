"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import {
  CheckCircle2,
  Copy,
  Database,
  ExternalLink,
  Eye,
  EyeOff,
  LayoutDashboard,
  LogOut,
  Mail,
  Plus,
  RefreshCw,
  Settings2,
  Sparkles,
  Star,
  Trash2,
  Wrench,
} from "lucide-react";
import {
  SUPABASE_PROJECT,
  checkSchemaReady,
  deleteMessage,
  deleteSkill,
  fetchContactMessages,
  markMessageRead,
  replaceAllSkills,
  updateAbout,
  upsertSkill,
  type ContactMessage,
} from "@/lib/api/admin";
import { fetchAbout, fetchSkills } from "@/lib/api/content";
import {
  createProject,
  deleteProject,
  fetchProjects,
  toggleFeatured,
  updateProject,
  updateProjectOrder,
  uploadProfileImage,
  uploadProjectImage,
} from "@/lib/api/projects";
import { ProjectImage } from "@/components/projects/ProjectImage";
import { fallbackAbout } from "@/lib/fallback";
import { DEFAULT_SKILLS, SKILL_CATEGORIES } from "@/lib/skills-data";
import { createClient } from "@/lib/supabase/client";
import type { AboutSettings, Project, ProjectFormData, Skill } from "@/lib/types";
import { liveSitePreviewUrl } from "@/lib/utils";

type Tab = "overview" | "projects" | "messages" | "skills" | "about" | "setup";

const emptyForm: ProjectFormData = {
  title: "",
  description: "",
  tech_stack: "",
  live_url: "",
  github_url: "",
  image_url: "",
  featured: false,
  order: 0,
  category: "Full-Stack",
};

const inputClass =
  "mt-2 w-full border border-gold/20 bg-ink px-3 py-2.5 text-sm text-cream outline-none transition focus:border-gold/50";
const labelClass = "block text-xs tracking-[0.14em] text-gold uppercase";
const btnGold =
  "inline-flex items-center justify-center gap-2 bg-gold px-5 py-2.5 text-xs font-semibold tracking-[0.16em] text-on-gold uppercase transition hover:bg-gold-bright disabled:opacity-60";
const btnGhost =
  "inline-flex items-center justify-center gap-2 border border-gold/30 px-4 py-2.5 text-xs tracking-[0.16em] text-gold uppercase transition hover:bg-gold/10";

export default function AdminDashboard() {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("brikemanuel@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState(false);

  const [tab, setTab] = useState<Tab>("overview");
  const [schemaReady, setSchemaReady] = useState<boolean | null>(null);
  const [schemaMessage, setSchemaMessage] = useState<string | null>(null);
  const [schemaSql, setSchemaSql] = useState("");
  const [copied, setCopied] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [about, setAbout] = useState<AboutSettings>(fallbackAbout);

  const [form, setForm] = useState<ProjectFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [skillForm, setSkillForm] = useState({
    id: "",
    name: "",
    category: "Web Dev",
    proficiency: 85,
    order: 0,
  });

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  };

  const refreshSchema = useCallback(async () => {
    const status = await checkSchemaReady();
    setSchemaReady(status.ready);
    setSchemaMessage(status.ready ? null : status.message);
    if (!status.ready) setTab("setup");
    return status.ready;
  }, []);

  const loadAll = useCallback(async () => {
    const ready = await refreshSchema();
    if (!ready) return;
    const [p, m, s, a] = await Promise.all([
      fetchProjects(),
      fetchContactMessages().catch(() => [] as ContactMessage[]),
      fetchSkills().catch(() => [] as Skill[]),
      fetchAbout().catch(() => fallbackAbout),
    ]);
    setProjects(p);
    setMessages(m);
    setSkills(s);
    setAbout(a);
  }, [refreshSchema]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setAuthLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      loadAll().catch((err) =>
        showToast(err instanceof Error ? err.message : "Failed to load admin data"),
      );
      fetch("/api/schema")
        .then((r) => r.text())
        .then((sql) => {
          if (!cancelled) setSchemaSql(sql);
        })
        .catch(() => {
          if (!cancelled) setSchemaSql("");
        });
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [user, loadAll]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const timer = window.setTimeout(() => setFilePreview(url), 0);
    return () => {
      window.clearTimeout(timer);
      URL.revokeObjectURL(url);
    };
  }, [file]);

  useEffect(() => {
    const timer = window.setTimeout(() => setPreviewFailed(false), 0);
    return () => window.clearTimeout(timer);
  }, [file, form.image_url, form.live_url]);

  const resolvedPreviewUrl = useMemo(() => {
    if (previewFailed) return null;
    if (file && filePreview) return filePreview;
    if (!file && form.image_url) return form.image_url;
    if (!file && form.live_url) return liveSitePreviewUrl(form.live_url, 900);
    return null;
  }, [file, filePreview, form.image_url, form.live_url, previewFailed]);

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setAuthError(null);
    setAuthBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setAuthError(error.message);
    } catch (err) {
      setAuthError(
        err instanceof Error
          ? err.message
          : "Cannot connect right now. Check your connection.",
      );
    } finally {
      setAuthBusy(false);
    }
  }

  async function onLogout() {
    await supabase.auth.signOut();
    setProjects([]);
    setMessages([]);
    setTab("overview");
  }

  function startEdit(project: Project) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      tech_stack: project.tech_stack.join(", "),
      live_url: project.live_url ?? "",
      github_url: project.github_url ?? "",
      image_url: project.image_url ?? "",
      featured: project.featured,
      order: project.order,
      category: project.category,
    });
    setFile(null);
    setTab("projects");
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setFile(null);
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      let imageUrl = form.image_url;
      let imageFile: string | undefined;
      if (file) {
        const uploaded = await uploadProjectImage(file);
        imageUrl = uploaded.publicUrl;
        imageFile = uploaded.path;
      }
      const payload = { ...form, image_url: imageUrl };
      if (editingId) {
        await updateProject(editingId, payload);
        if (imageFile) {
          await supabase
            .from("projects")
            .update({ image_file: imageFile })
            .eq("id", editingId);
        }
        showToast("Project updated");
      } else {
        const created = await createProject(payload);
        if (imageFile) {
          await supabase
            .from("projects")
            .update({ image_file: imageFile })
            .eq("id", created.id);
        }
        showToast("Project created");
      }
      resetForm();
      await loadAll();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function copySchema() {
    await navigator.clipboard.writeText(schemaSql);
    setCopied(true);
    showToast("Schema SQL copied");
    window.setTimeout(() => setCopied(false), 2000);
  }

  async function saveAbout(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    try {
      let next: AboutSettings = { ...about };
      const photoInput = e.currentTarget.about_photo as HTMLInputElement | undefined;
      const file = photoInput?.files?.[0];
      if (file) {
        const uploaded = await uploadProfileImage(file);
        next = { ...next, photo_url: uploaded.publicUrl };
      } else if (next.photo_url.startsWith("blob:")) {
        next = { ...next, photo_url: "" };
      }
      setAbout(next);
      await updateAbout(next);
      showToast("About settings saved");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function saveSkill(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await upsertSkill({
        id: skillForm.id || undefined,
        name: skillForm.name,
        category: skillForm.category,
        proficiency: skillForm.proficiency,
        order: skillForm.order,
      });
      setSkillForm({
        id: "",
        name: "",
        category: "Web Dev",
        proficiency: 85,
        order: skills.length + 1,
      });
      showToast(skillForm.id ? "Skill updated" : "Skill added");
      await loadAll();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Skill save failed");
    } finally {
      setBusy(false);
    }
  }

  async function loadFullSkillSet() {
    if (
      !confirm(
        "Replace all current skills with the full Web Dev, Marketing, Sales, and Business set?",
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      await replaceAllSkills(DEFAULT_SKILLS);
      showToast("Full skill set loaded");
      await loadAll();
      setTab("skills");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not load skills");
    } finally {
      setBusy(false);
    }
  }

  if (authLoading) {
    return (
      <div className="section-pad flex min-h-screen items-center justify-center text-cream-dim">
        Checking session…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="section-pad relative flex min-h-screen items-center justify-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(198,161,91,0.18),transparent_55%)]" />
        <form
          onSubmit={onLogin}
          className="relative w-full max-w-md space-y-5 border border-gold/25 bg-ink-soft/70 p-8 backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <Image
              src="/brand/mark.png"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
            />
            <div>
              <p className="text-[10px] tracking-[0.28em] text-gold uppercase">
                Thanda Manuel
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-3xl text-cream">
                Admin
              </h1>
            </div>
          </div>

          <label className={labelClass}>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            Password
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gold/20 bg-ink px-3 py-2.5 pr-10 text-sm text-cream outline-none focus:border-gold/50"
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-cream-dim"
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Toggle password"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {authError && (
            <p className="border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {authError}
            </p>
          )}

          <button type="submit" disabled={authBusy} className={`${btnGold} w-full`}>
            {authBusy ? "Signing in…" : "Sign in"}
          </button>

          <Link href="/" className="block text-center text-xs tracking-[0.18em] text-gold uppercase">
            ← Back to portfolio
          </Link>
        </form>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={14} /> },
    { id: "projects", label: "Projects", icon: <Sparkles size={14} /> },
    { id: "messages", label: "Messages", icon: <Mail size={14} /> },
    { id: "skills", label: "Skills", icon: <Wrench size={14} /> },
    { id: "about", label: "About", icon: <Settings2 size={14} /> },
    { id: "setup", label: "Setup", icon: <Database size={14} /> },
  ];

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="section-pad mx-auto max-w-7xl py-10 md:py-14">
      {toast && (
        <div className="fixed top-20 right-4 z-50 border border-gold/30 bg-ink-soft px-4 py-3 text-sm text-cream shadow-xl">
          {toast}
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/" className="text-xs tracking-[0.2em] text-gold uppercase">
            ← Portfolio
          </Link>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-cream">
            Admin console
          </h1>
          <p className="mt-1 text-sm text-cream-dim">{user.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btnGhost} onClick={() => loadAll()}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button type="button" className={btnGhost} onClick={onLogout}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>

      {schemaReady === false && (
        <div className="mt-6 border border-amber-400/40 bg-amber-500/10 p-5">
          <p className="font-medium text-cream">Database setup required</p>
          <p className="mt-1 text-sm text-cream-dim">
            Tables are missing. Open Setup, copy the SQL, and run it in your
            project SQL editor.
          </p>
          <button
            type="button"
            className={`${btnGold} mt-4`}
            onClick={() => setTab("setup")}
          >
            Open setup
          </button>
        </div>
      )}

      <div className="mt-8 flex gap-2 overflow-x-auto border-b border-gold/15 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`inline-flex shrink-0 items-center gap-2 px-3 py-2.5 text-xs tracking-[0.14em] uppercase transition ${
              tab === item.id
                ? "bg-gold text-on-gold"
                : "text-cream-dim hover:text-gold"
            }`}
          >
            {item.icon}
            {item.label}
            {item.id === "messages" && unread > 0 && (
              <span className="bg-on-gold/20 px-1.5 text-[10px]">{unread}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Projects", value: projects.length },
            { label: "Featured", value: projects.filter((p) => p.featured).length },
            { label: "Messages", value: messages.length },
            { label: "Skills", value: skills.length },
          ].map((card) => (
            <div
              key={card.label}
              className="border border-gold/20 bg-ink-soft/40 p-5"
            >
              <p className="text-xs tracking-[0.2em] text-gold uppercase">
                {card.label}
              </p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-4xl text-cream">
                {schemaReady ? card.value : "—"}
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === "setup" && (
        <div className="mt-8 space-y-5">
          <div className="border border-gold/20 bg-ink-soft/40 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-cream">
                  One-time setup
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-cream-dim">
                  Paste this SQL into your project SQL editor (
                  <code className="text-gold">{SUPABASE_PROJECT.ref}</code>
                  ). It creates your tables, storage, and starter content.
                </p>
              </div>
              {schemaReady ? (
                <span className="inline-flex items-center gap-2 text-sm text-emerald-300">
                  <CheckCircle2 size={16} /> Schema ready
                </span>
              ) : (
                <span className="text-sm text-amber-200">
                  {schemaMessage || "Tables not found yet"}
                </span>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" className={btnGold} onClick={copySchema}>
                <Copy size={14} /> {copied ? "Copied" : "Copy SQL"}
              </button>
              <a
                href={SUPABASE_PROJECT.sqlEditor}
                target="_blank"
                rel="noopener noreferrer"
                className={btnGhost}
              >
                Open SQL Editor <ExternalLink size={14} />
              </a>
              <button
                type="button"
                className={btnGhost}
                onClick={async () => {
                  const ready = await refreshSchema();
                  if (ready) {
                    showToast("Schema detected — loading data");
                    await loadAll();
                    setTab("projects");
                  } else {
                    showToast("Still missing tables — run the SQL first");
                  }
                }}
              >
                <RefreshCw size={14} /> I ran the SQL — check again
              </button>
            </div>

            <pre className="mt-5 max-h-80 overflow-auto border border-gold/15 bg-ink p-4 text-[11px] leading-relaxed text-cream-dim">
              {schemaSql || "Loading schema.sql…"}
            </pre>
          </div>
        </div>
      )}

      {tab === "projects" && (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={onSave} className="space-y-4 border border-gold/20 bg-ink-soft/40 p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-cream">
                {editingId ? "Edit project" : "Add project"}
              </h2>
              {!editingId && (
                <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.16em] text-gold uppercase">
                  <Plus size={12} /> New
                </span>
              )}
            </div>

            <label className={labelClass}>
              Title
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Category
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
              >
                <option>Full-Stack</option>
                <option>Business</option>
                <option>Mobile</option>
                <option>Internal</option>
              </select>
            </label>

            <label className={labelClass}>
              Description
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Tech stack (comma separated)
              <input
                value={form.tech_stack}
                onChange={(e) =>
                  setForm({ ...form, tech_stack: e.target.value })
                }
                className={inputClass}
                placeholder="TypeScript, React, PostgreSQL"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Live URL
                <input
                  type="url"
                  value={form.live_url}
                  onChange={(e) =>
                    setForm({ ...form, live_url: e.target.value })
                  }
                  className={inputClass}
                  placeholder="https://angoavalia.com"
                />
              </label>
              <label className={labelClass}>
                GitHub URL
                <input
                  type="url"
                  value={form.github_url}
                  onChange={(e) =>
                    setForm({ ...form, github_url: e.target.value })
                  }
                  className={inputClass}
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Order
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) =>
                    setForm({ ...form, order: Number(e.target.value) || 0 })
                  }
                  className={inputClass}
                />
              </label>
              <label className="flex items-end gap-3 pb-2 text-sm text-cream">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({ ...form, featured: e.target.checked })
                  }
                />
                Featured on homepage
              </label>
            </div>

            <label className={labelClass}>
              Upload image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="mt-2 w-full text-sm text-cream-dim"
              />
            </label>

            <label className={labelClass}>
              Or image URL
              <input
                type="url"
                value={form.image_url}
                onChange={(e) =>
                  setForm({ ...form, image_url: e.target.value })
                }
                className={inputClass}
              />
            </label>

            <p className="text-xs text-cream-dim">
              Tip: paste a live URL for an automatic free site preview. For the
              best look, upload your own screenshot.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button type="submit" disabled={busy || schemaReady === false} className={btnGold}>
                {busy ? "Saving…" : editingId ? "Update project" : "Create project"}
              </button>
              {editingId && (
                <button type="button" className={btnGhost} onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="space-y-4">
            <div className="overflow-hidden border border-gold/20 bg-ink-soft/40">
              <div className="border-b border-gold/15 px-4 py-3 text-xs tracking-[0.16em] text-gold uppercase">
                Live preview
              </div>
              {resolvedPreviewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolvedPreviewUrl}
                  alt="Preview"
                  className="aspect-[16/10] w-full object-cover"
                  onError={() => setPreviewFailed(true)}
                />
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center text-sm text-cream-dim">
                  Add a live URL or image
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="font-[family-name:var(--font-display)] text-xl text-cream">
                All projects ({projects.length})
              </h3>
              {projects.length === 0 && (
                <p className="border border-gold/15 p-4 text-sm text-cream-dim">
                  No projects yet. Create your first one after schema setup.
                </p>
              )}
              {projects.map((project) => {
                return (
                  <div
                    key={project.id}
                    className="flex flex-col gap-3 border border-gold/15 p-3 sm:flex-row sm:items-center"
                  >
                    <div className="h-16 w-28 overflow-hidden bg-ink">
                      <ProjectImage
                        project={project}
                        className="h-16 w-28"
                        imgClassName="h-16 w-28 object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-cream">
                        {project.title}
                        {project.featured && (
                          <Star
                            size={12}
                            className="ml-2 inline text-gold"
                            fill="currentColor"
                          />
                        )}
                      </p>
                      <p className="text-xs text-cream-dim">
                        {project.category} · order {project.order}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        className="border border-gold/25 px-2 py-1 text-[11px] text-gold"
                        onClick={() => startEdit(project)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="border border-gold/25 px-2 py-1 text-[11px] text-gold"
                        onClick={async () => {
                          await toggleFeatured(project.id, !project.featured);
                          await loadAll();
                        }}
                      >
                        Feature
                      </button>
                      <button
                        type="button"
                        className="border border-gold/25 px-2 py-1 text-[11px] text-gold"
                        onClick={async () => {
                          await updateProjectOrder(project.id, project.order - 1);
                          await loadAll();
                        }}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="border border-gold/25 px-2 py-1 text-[11px] text-gold"
                        onClick={async () => {
                          await updateProjectOrder(project.id, project.order + 1);
                          await loadAll();
                        }}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="border border-red-400/40 px-2 py-1 text-[11px] text-red-300"
                        onClick={async () => {
                          if (!confirm(`Delete ${project.title}?`)) return;
                          await deleteProject(project.id);
                          await loadAll();
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === "messages" && (
        <div className="mt-8 space-y-3">
          {messages.length === 0 ? (
            <p className="border border-gold/15 p-6 text-cream-dim">
              No contact messages yet.
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`border p-5 ${
                  msg.read
                    ? "border-gold/10 bg-ink-soft/20"
                    : "border-gold/30 bg-ink-soft/50"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-cream">
                      {msg.name}{" "}
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-sm text-gold"
                      >
                        {msg.email}
                      </a>
                    </p>
                    <p className="mt-1 text-xs text-cream-dim">
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={btnGhost}
                      onClick={async () => {
                        await markMessageRead(msg.id, !msg.read);
                        await loadAll();
                      }}
                    >
                      {msg.read ? "Mark unread" : "Mark read"}
                    </button>
                    <button
                      type="button"
                      className="border border-red-400/40 px-3 py-2 text-xs text-red-300"
                      onClick={async () => {
                        await deleteMessage(msg.id);
                        await loadAll();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm text-cream-dim">
                  {msg.message}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "skills" && (
        <div className="mt-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border border-gold/20 bg-ink-soft/30 p-4">
            <p className="text-sm text-cream-dim">
              Categories: Web Dev, Marketing, Sales, Business — including Render,
              Hostinger, B2B sales, BPO, and growth.
            </p>
            <button
              type="button"
              className={btnGold}
              disabled={busy || !schemaReady}
              onClick={loadFullSkillSet}
            >
              Load full skill set
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={saveSkill} className="space-y-4 border border-gold/20 bg-ink-soft/40 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-cream">
              {skillForm.id ? "Edit skill" : "Add skill"}
            </h2>
            <label className={labelClass}>
              Name
              <input
                required
                value={skillForm.name}
                onChange={(e) =>
                  setSkillForm({ ...skillForm, name: e.target.value })
                }
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Category
              <select
                required
                value={skillForm.category}
                onChange={(e) =>
                  setSkillForm({ ...skillForm, category: e.target.value })
                }
                className={inputClass}
              >
                {SKILL_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              Proficiency ({skillForm.proficiency}%)
              <input
                type="range"
                min={0}
                max={100}
                value={skillForm.proficiency}
                onChange={(e) =>
                  setSkillForm({
                    ...skillForm,
                    proficiency: Number(e.target.value),
                  })
                }
                className="mt-3 w-full"
              />
            </label>
            <label className={labelClass}>
              Order
              <input
                type="number"
                value={skillForm.order}
                onChange={(e) =>
                  setSkillForm({
                    ...skillForm,
                    order: Number(e.target.value) || 0,
                  })
                }
                className={inputClass}
              />
            </label>
            <div className="flex gap-3">
              <button type="submit" disabled={busy || !schemaReady} className={btnGold}>
                {skillForm.id ? "Update" : "Add skill"}
              </button>
              {skillForm.id && (
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() =>
                    setSkillForm({
                      id: "",
                      name: "",
                      category: "Web Dev",
                      proficiency: 85,
                      order: 0,
                    })
                  }
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="max-h-[40rem] space-y-2 overflow-y-auto">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between gap-3 border border-gold/15 px-4 py-3"
              >
                <div>
                  <p className="text-cream">{skill.name}</p>
                  <p className="text-xs text-cream-dim">
                    {skill.category} · {skill.proficiency}%
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="border border-gold/25 px-2 py-1 text-[11px] text-gold"
                    onClick={() =>
                      setSkillForm({
                        id: skill.id,
                        name: skill.name,
                        category: skill.category,
                        proficiency: skill.proficiency,
                        order: skill.order,
                      })
                    }
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="border border-red-400/40 px-2 py-1 text-[11px] text-red-300"
                    onClick={async () => {
                      await deleteSkill(skill.id);
                      await loadAll();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      )}

      {tab === "about" && (
        <form
          onSubmit={saveAbout}
          className="mt-8 grid max-w-4xl gap-6 border border-gold/20 bg-ink-soft/40 p-6 md:grid-cols-[0.85fr_1.15fr]"
        >
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-cream">
              Your photo
            </h2>
            <p className="mt-2 text-sm text-cream-dim">
              Upload a portrait for the About page. It appears next to your bio.
            </p>
            <div className="mt-4 overflow-hidden border border-gold/20 bg-ink">
              {about.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={about.photo_url}
                  alt={about.name}
                  className="aspect-[4/5] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center p-6 text-center text-sm text-cream-dim">
                  No photo yet — upload one below
                </div>
              )}
            </div>
            <label className={`${labelClass} mt-4`}>
              Upload photo
              <input
                name="about_photo"
                type="file"
                accept="image/*"
                className="mt-2 w-full text-sm text-cream-dim"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = URL.createObjectURL(file);
                  setAbout((prev) => ({ ...prev, photo_url: url }));
                }}
              />
            </label>
            <label className={`${labelClass} mt-4`}>
              Or photo URL
              <input
                type="url"
                value={about.photo_url.startsWith("blob:") ? "" : about.photo_url}
                onChange={(e) =>
                  setAbout({ ...about, photo_url: e.target.value })
                }
                className={inputClass}
                placeholder="https://…"
              />
            </label>
            {about.photo_url && (
              <button
                type="button"
                className={`${btnGhost} mt-3`}
                onClick={() => setAbout({ ...about, photo_url: "" })}
              >
                Remove photo
              </button>
            )}
          </div>

          <div className="grid gap-4 content-start">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-cream">
              About / settings
            </h2>
            {(
              [
                ["name", "Name"],
                ["email", "Email"],
                ["phone", "Phone"],
                ["location", "Location"],
                ["github_url", "GitHub URL"],
                ["tagline", "Tagline"],
                ["headline", "Headline"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className={labelClass}>
                {label}
                <input
                  type={key === "github_url" ? "url" : "text"}
                  value={about[key]}
                  onChange={(e) =>
                    setAbout({ ...about, [key]: e.target.value })
                  }
                  className={inputClass}
                  placeholder={
                    key === "github_url" ? "https://github.com/Skylink2024" : undefined
                  }
                />
              </label>
            ))}
            <label className={labelClass}>
              Bio
              <textarea
                rows={6}
                value={about.bio}
                onChange={(e) => setAbout({ ...about, bio: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Roles (comma separated)
              <input
                value={about.roles.join(", ")}
                onChange={(e) =>
                  setAbout({
                    ...about,
                    roles: e.target.value
                      .split(",")
                      .map((r) => r.trim())
                      .filter(Boolean),
                  })
                }
                className={inputClass}
              />
            </label>
            <button
              type="submit"
              disabled={busy || !schemaReady}
              className={btnGold}
            >
              {busy ? "Saving…" : "Save about"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
