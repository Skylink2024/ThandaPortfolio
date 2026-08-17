#!/usr/bin/env node
/**
 * Creates/updates the portfolio admin user in YOUR ThandaPortfolio Supabase project.
 * Usage: node scripts/create-admin.mjs
 * Reads credentials from .env.local — does not print the password.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const secret = env.SUPABASE_SECRET_KEY;
const email = process.env.ADMIN_EMAIL || "brikemanuel@gmail.com";
const password = process.env.ADMIN_PASSWORD;

if (!url || !secret) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local");
  process.exit(1);
}
if (!password) {
  console.error("Set ADMIN_PASSWORD in the environment (do not commit it).");
  process.exit(1);
}

const admin = createClient(url, secret, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { name: "Thanda Manuel", role: "admin" },
});

if (!error) {
  console.log("Admin created:", data.user?.id);
  process.exit(0);
}

if (!/already|registered|exists/i.test(error.message)) {
  console.error("Create failed:", error.message);
  process.exit(1);
}

const listed = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
if (listed.error) {
  console.error(listed.error.message);
  process.exit(1);
}
const user = listed.data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
if (!user) {
  console.error("User exists but could not be found via listUsers.");
  process.exit(1);
}
const upd = await admin.auth.admin.updateUserById(user.id, {
  password,
  email_confirm: true,
});
if (upd.error) {
  console.error(upd.error.message);
  process.exit(1);
}
console.log("Admin password updated for existing user:", user.id);
