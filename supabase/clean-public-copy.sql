-- Clean visitor-facing copy: remove "Supabase" from skills, about, and project tags.
-- Run once in the ThandaPortfolio SQL Editor.

update public.skills
set name = 'PostgreSQL'
where name = 'Supabase / PostgreSQL';

update public.settings
set
  value = jsonb_set(
    value,
    '{bio}',
    to_jsonb(
      replace(
        coalesce(value->>'bio', ''),
        'TypeScript, Supabase, and modern',
        'TypeScript and modern'
      )
    )
  ),
  updated_at = now()
where key = 'about';

update public.projects
set
  description = replace(description, 'TypeScript, Supabase, and modern', 'TypeScript, PostgreSQL, and modern'),
  tech_stack = array(
    select case when t = 'Supabase' then 'PostgreSQL' else t end
    from unnest(tech_stack) as t
  );
