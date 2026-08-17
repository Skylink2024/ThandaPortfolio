"use client";

import { FormEvent, useState } from "react";
import type { AboutSettings } from "@/lib/types";

function toWhatsAppNumber(phone: string) {
  return phone.replace(/\D/g, "");
}

function buildWhatsAppUrl(phone: string, text: string) {
  const number = toWhatsAppNumber(phone);
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function Contact({
  about,
  showIntro = true,
}: {
  about: AboutSettings;
  showIntro?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "ok">("idle");
  const whatsappNumber = toWhatsAppNumber(about.phone);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    const text = [
      `Hello Thanda, I'd like to get in touch.`,
      ``,
      `Name: ${name}`,
      `Email: ${email}`,
      ``,
      `Message:`,
      message,
    ].join("\n");

    const url = buildWhatsAppUrl(about.phone, text);
    window.open(url, "_blank", "noopener,noreferrer");
    form.reset();
    setStatus("ok");
  }

  return (
    <section className="section-pad pb-28 md:pb-36">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          {showIntro && (
            <>
              <p className="text-xs tracking-[0.35em] text-gold uppercase">Contact</p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-cream md:text-6xl">
                Let&apos;s build something that ships.
              </h2>
            </>
          )}
          {!showIntro && (
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-cream md:text-5xl">
              Let&apos;s build something that ships.
            </h2>
          )}
          <p className="mt-5 max-w-md text-cream-dim">
            Available for full-stack product work, business websites, and
            systems that connect sales reality to technical delivery. Messages
            open directly in WhatsApp.
          </p>
          <div className="mt-8 space-y-3 text-sm text-cream-dim">
            <p>
              <a className="break-all hover:text-gold" href={`mailto:${about.email}`}>
                {about.email}
              </a>
            </p>
            <p>
              <a
                className="hover:text-gold"
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp · {about.phone}
              </a>
            </p>
            <p>{about.location}</p>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 border border-gold/20 bg-ink-soft/40 p-6 md:p-8"
        >
          <label className="block text-xs tracking-[0.18em] text-gold uppercase">
            Name
            <input
              required
              name="name"
              className="mt-2 w-full border border-gold/20 bg-ink px-3 py-3 text-sm text-cream outline-none focus:border-gold/50"
            />
          </label>
          <label className="block text-xs tracking-[0.18em] text-gold uppercase">
            Email
            <input
              required
              type="email"
              name="email"
              className="mt-2 w-full border border-gold/20 bg-ink px-3 py-3 text-sm text-cream outline-none focus:border-gold/50"
            />
          </label>
          <label className="block text-xs tracking-[0.18em] text-gold uppercase">
            Message
            <textarea
              required
              name="message"
              rows={5}
              className="mt-2 w-full resize-y border border-gold/20 bg-ink px-3 py-3 text-sm text-cream outline-none focus:border-gold/50"
            />
          </label>
          <button
            type="submit"
            className="w-full bg-gold px-4 py-3 text-xs font-semibold tracking-[0.2em] text-on-gold uppercase transition hover:bg-gold-bright"
          >
            Send on WhatsApp
          </button>
          {status === "ok" && (
            <p className="text-sm text-gold">
              WhatsApp opened with your message. Send it there to reach me.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
