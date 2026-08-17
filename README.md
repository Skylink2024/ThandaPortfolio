# Thanda Manuel Portfolio

Luxury full-stack portfolio powered by **your ThandaPortfolio Supabase project** (`zvicutdibrqpflliwlvi`) — not Angola Avalia.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres, Auth, Storage)
- Framer Motion

## 1. Connect Supabase (already wired in `.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://zvicutdibrqpflliwlvi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...   # server only — never commit / never NEXT_PUBLIC_
```

## 2. Run the database schema

In the **ThandaPortfolio** project dashboard:

1. Open **SQL Editor**
2. Paste and run [`supabase/schema.sql`](supabase/schema.sql)

This creates `projects`, `skills`, `settings`, `contact_messages`, RLS policies, the public `portfolio-images` bucket, and seed data (your projects + skills + about).

## 3. Create your admin user

Supabase → **Authentication** → **Users** → Add user (email/password).  
Then sign in at `/admin`.

## 4. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- Cinematic gold-branded hero with your TM logo
- Projects grid with category filter, featured badge, auto site screenshots from `live_url`
- Project detail pages
- Skills + About from Supabase
- Contact form → `contact_messages`
- Admin CRUD + Storage image upload + reorder / featured toggle

## Deploy (Vercel)

1. Push to GitHub
2. Import in Vercel
3. Add the same env vars (do **not** expose `SUPABASE_SECRET_KEY` as `NEXT_PUBLIC_`)
4. Deploy

## Security note

You shared a secret key in chat. After setup, rotate `sb_secret_...` in the Supabase dashboard if this chat may be retained.
