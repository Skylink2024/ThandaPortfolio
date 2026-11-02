-- ThandaPortfolio schema
-- Run in Supabase Dashboard → SQL Editor for project: xtxoiwlzrtjwvawfqbfb
-- https://supabase.com/dashboard/project/xtxoiwlzrtjwvawfqbfb/sql/new
-- NOT Angola Avalia

-- Extensions
create extension if not exists "pgcrypto";

-- Projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  description text not null,
  tech_stack text[] not null default '{}',
  live_url text,
  github_url text,
  image_url text,
  image_file text,
  featured boolean not null default false,
  "order" integer not null default 0,
  category text not null default 'Full-Stack'
);

-- Skills
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  category text not null,
  proficiency integer not null default 80 check (proficiency between 0 and 100),
  "order" integer not null default 0
);

-- Site settings (about, contact, etc.)
create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Contact messages
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false
);

-- Indexes
create index if not exists projects_order_idx on public.projects ("order");
create index if not exists projects_featured_idx on public.projects (featured);
create index if not exists projects_category_idx on public.projects (category);
create index if not exists skills_order_idx on public.skills ("order");

-- RLS
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.settings enable row level security;
alter table public.contact_messages enable row level security;

-- Public read
drop policy if exists "Public read projects" on public.projects;
create policy "Public read projects"
  on public.projects for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read skills" on public.skills;
create policy "Public read skills"
  on public.skills for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read settings" on public.settings;
create policy "Public read settings"
  on public.settings for select
  to anon, authenticated
  using (true);

-- Authenticated write (admin)
drop policy if exists "Auth manage projects" on public.projects;
create policy "Auth manage projects"
  on public.projects for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Auth manage skills" on public.skills;
create policy "Auth manage skills"
  on public.skills for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Auth manage settings" on public.settings;
create policy "Auth manage settings"
  on public.settings for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Auth read contact" on public.contact_messages;
create policy "Auth read contact"
  on public.contact_messages for select
  to authenticated
  using (true);

drop policy if exists "Auth update contact" on public.contact_messages;
create policy "Auth update contact"
  on public.contact_messages for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Anyone insert contact" on public.contact_messages;
create policy "Anyone insert contact"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

-- Storage bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-images',
  'portfolio-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update set public = true;

drop policy if exists "Public read portfolio images" on storage.objects;
create policy "Public read portfolio images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'portfolio-images');

drop policy if exists "Auth upload portfolio images" on storage.objects;
create policy "Auth upload portfolio images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio-images');

drop policy if exists "Auth update portfolio images" on storage.objects;
create policy "Auth update portfolio images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-images')
  with check (bucket_id = 'portfolio-images');

drop policy if exists "Auth delete portfolio images" on storage.objects;
create policy "Auth delete portfolio images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-images');

drop policy if exists "Auth delete contact" on public.contact_messages;
create policy "Auth delete contact"
  on public.contact_messages for delete
  to authenticated
  using (true);

-- Seed: about
insert into public.settings (key, value)
values (
  'about',
  '{
    "name": "Thanda Manuel",
    "email": "Brikemanuel@gmail.com",
    "location": "Cape Town, South Africa",
    "phone": "+27 671280592",
    "tagline": "Purpose · Disciple · Legacy",
    "headline": "Full-stack developer who ships production products.",
    "bio": "Full-stack developer with 7+ live production applications built using TypeScript and modern JavaScript frameworks, combined with 4+ years of B2B sales, partnership development, and digital marketing experience. Built and deployed review platforms, a B2B procurement portal, business websites, and a custom CRM — with authentication, API integrations, and SEO optimization. Ships fast, works independently, and translates business problems into technical solutions. Fluent in English, Portuguese, and Spanish.",
    "roles": ["Full-Stack Developer", "Digital Marketing Specialist", "Product Builder"],
    "photo_url": "",
    "github_url": "https://github.com/Skylink2024"
  }'::jsonb
)
on conflict (key) do update set value = excluded.value, updated_at = now();

-- Seed: skills (Web Dev, Marketing, Sales, Business)
insert into public.skills (name, category, proficiency, "order")
select * from (values
  ('TypeScript', 'Web Dev', 95, 1),
  ('JavaScript (ES6+)', 'Web Dev', 95, 2),
  ('React / Next.js', 'Web Dev', 92, 3),
  ('React Native', 'Web Dev', 85, 4),
  ('Node.js', 'Web Dev', 88, 5),
  ('HTML5 / CSS3', 'Web Dev', 95, 6),
  ('PostgreSQL', 'Web Dev', 95, 7),
  ('REST APIs & Auth', 'Web Dev', 92, 8),
  ('Git / GitHub', 'Web Dev', 92, 9),
  ('Vercel', 'Web Dev', 90, 10),
  ('Render', 'Web Dev', 92, 11),
  ('Hostinger', 'Web Dev', 90, 12),
  ('Cloudflare', 'Web Dev', 86, 13),
  ('Cursor AI / AI-Assisted Development', 'Web Dev', 95, 14),
  ('No-Code / Low-Code Solutions', 'Web Dev', 88, 15),
  ('Brand Development', 'Marketing', 91, 20),
  ('Business Positioning', 'Marketing', 91, 21),
  ('Personal Branding', 'Marketing', 90, 22),
  ('Marketing Collateral', 'Marketing', 92, 23),
  ('Canva Design', 'Marketing', 90, 24),
  ('SEO Optimization', 'Marketing', 88, 25),
  ('Google Ads', 'Marketing', 82, 26),
  ('Digital Business Development', 'Marketing', 90, 27),
  ('B2B Sales', 'Sales', 96, 30),
  ('Outbound Sales', 'Sales', 97, 31),
  ('Lead Generation', 'Sales', 96, 32),
  ('Sales Process Development', 'Sales', 94, 33),
  ('Sales Team Coaching', 'Sales', 95, 34),
  ('Sales Performance Optimization', 'Sales', 94, 35),
  ('Client Acquisition', 'Sales', 94, 36),
  ('SDR Team Leadership', 'Sales', 94, 37),
  ('Call Auditing', 'Sales', 96, 38),
  ('KPI Management', 'Sales', 94, 39),
  ('Performance Coaching', 'Sales', 95, 40),
  ('Sales Training', 'Sales', 93, 41),
  ('PIP Development', 'Sales', 91, 42),
  ('Prospect Research', 'Sales', 96, 43),
  ('Business Building', 'Business', 95, 50),
  ('Business Development', 'Business', 95, 51),
  ('Business Model Development', 'Business', 93, 52),
  ('Business Strategy', 'Business', 92, 53),
  ('Market Expansion', 'Business', 90, 54),
  ('Revenue Strategy', 'Business', 91, 55),
  ('BPO Business Development', 'Business', 95, 56),
  ('BPO Operations', 'Business', 91, 57),
  ('Outsourcing Strategy', 'Business', 93, 58),
  ('Workforce Planning', 'Business', 89, 59),
  ('Service Pricing & Commercial Modeling', 'Business', 92, 60),
  ('ICP Development', 'Business', 94, 61),
  ('Market Research', 'Business', 93, 62),
  ('Competitor Research', 'Business', 90, 63),
  ('Sales Market Analysis', 'Business', 92, 64),
  ('Opportunity Identification', 'Business', 95, 65),
  ('AI-Assisted Business Research', 'Business', 94, 66),
  ('AI Productivity', 'Business', 92, 67),
  ('AI Workflow Optimization', 'Business', 89, 68),
  ('CRM Strategy', 'Business', 91, 69)
) as v(name, category, proficiency, "order")
where not exists (select 1 from public.skills limit 1);

-- Seed: projects
insert into public.projects (title, description, tech_stack, live_url, featured, "order", category)
select * from (values
  (
    'AngoAvalia',
    'Full-stack review platform for companies in Angola. Google OAuth authentication, company profiles, user reviews, and dynamic search. Built with TypeScript, PostgreSQL, and modern JavaScript.',
    array['TypeScript', 'PostgreSQL', 'OAuth', 'React'],
    'https://angoavalia.com',
    true,
    1,
    'Full-Stack'
  ),
  (
    'Chega'' Qui',
    'B2B industrial procurement and sourcing platform enabling users to request products for sourcing, import, and delivery — serving mining, oil & gas, and laboratory equipment sectors.',
    array['TypeScript', 'React', 'PostgreSQL', 'APIs'],
    'https://chegaqui.com',
    true,
    2,
    'Business'
  ),
  (
    'Felo Creatives',
    'Creative agency website showcasing brand work, services, and a polished digital presence for a design-led studio.',
    array['JavaScript', 'HTML5', 'CSS3', 'SEO'],
    'https://felocreatives.com',
    false,
    3,
    'Business'
  ),
  (
    'Cresiate Partners',
    'BPO company site for Customer Support, Sales, and Back Office services — clear positioning and conversion-focused layout.',
    array['JavaScript', 'SEO', 'Hosting'],
    'https://cresiatepartners.com',
    false,
    4,
    'Business'
  ),
  (
    'Salokamba',
    'Business website for a cleaning services company — service pages, trust signals, and mobile-first contact flows.',
    array['JavaScript', 'CSS3', 'SEO'],
    'https://salokamba.com',
    false,
    5,
    'Business'
  ),
  (
    'Thanda Manuel CRM',
    'Personal CRM built to manage client work, projects, and business relationships across freelance engagements.',
    array['TypeScript', 'Auth', 'PostgreSQL', 'React'],
    null,
    true,
    6,
    'Full-Stack'
  )
) as v(title, description, tech_stack, live_url, featured, "order", category)
where not exists (select 1 from public.projects limit 1);
