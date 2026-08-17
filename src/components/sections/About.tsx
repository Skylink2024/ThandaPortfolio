"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import type { AboutSettings } from "@/lib/types";
import { GitBranch, Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/Motion";

export function About({
  about,
  showIntro = true,
}: {
  about: AboutSettings;
  showIntro?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [photoFailed, setPhotoFailed] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const showPhoto = Boolean(about.photo_url) && !photoFailed;

  return (
    <section ref={ref} className="section-pad relative pb-20 md:pb-40">
      <motion.p
        style={{ x }}
        className="pointer-events-none absolute top-8 left-0 hidden font-[family-name:var(--font-display)] text-[16vw] leading-none text-cream/[0.035] select-none sm:block"
      >
        ABOUT
      </motion.p>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 md:gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <Reveal>
          <div className="relative mx-auto w-full max-w-sm md:max-w-md">
            <div className="absolute -inset-4 rounded-full bg-gold/10 blur-3xl md:-inset-6" />
            <div className="relative overflow-hidden border border-gold/25 bg-ink-soft/40 backdrop-blur-md">
              {showPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={about.photo_url}
                  alt={about.name}
                  className="aspect-[4/5] w-full object-cover object-top"
                  onError={() => setPhotoFailed(true)}
                />
              ) : (
                <div className="flex aspect-[4/5] flex-col items-center justify-center gap-6 p-6 md:p-8">
                  <Image
                    src="/brand/logo-transparent.png"
                    alt="Thanda Manuel logo"
                    width={640}
                    height={280}
                    className="mx-auto h-auto w-full max-w-[240px] object-contain md:max-w-[280px]"
                  />
                </div>
              )}
              <div className="border-t border-gold/20 px-4 py-4 text-center md:px-6 md:py-5">
                <p className="font-[family-name:var(--font-display)] text-lg tracking-[0.1em] text-cream md:text-xl md:tracking-[0.12em]">
                  {about.name}
                </p>
                <p className="mt-2 text-[10px] tracking-[0.22em] text-gold uppercase md:text-xs md:tracking-[0.28em]">
                  {about.tagline}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="min-w-0">
          {showIntro && (
            <Reveal>
              <p className="text-xs tracking-[0.35em] text-gold uppercase">Who I am</p>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl leading-tight text-cream sm:text-4xl md:text-6xl">
                {about.headline}
              </h2>
            </Reveal>
          )}
          {!showIntro && (
            <Reveal>
              <h2 className="font-[family-name:var(--font-display)] text-2xl leading-tight text-cream sm:text-3xl md:text-5xl">
                {about.headline}
              </h2>
            </Reveal>
          )}
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl whitespace-pre-wrap text-sm leading-relaxed text-cream-dim sm:text-base md:text-lg">
              {about.bio}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-wrap gap-2 sm:gap-3">
              {about.roles.map((role) => (
                <span
                  key={role}
                  className="border border-gold/30 bg-gold/5 px-2.5 py-1.5 text-[10px] tracking-[0.12em] text-gold uppercase sm:px-3 sm:text-xs sm:tracking-[0.14em]"
                >
                  {role}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <ul className="mt-10 space-y-3 text-sm text-cream-dim">
              <li className="flex min-w-0 items-center gap-3">
                <Mail size={16} className="shrink-0 text-gold" />
                <a
                  href={`mailto:${about.email}`}
                  className="break-all transition hover:text-gold"
                >
                  {about.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="shrink-0 text-gold" />
                <a
                  href={`tel:${about.phone.replace(/\s/g, "")}`}
                  className="transition hover:text-gold"
                >
                  {about.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="shrink-0 text-gold" />
                {about.location}
              </li>
              {about.github_url && (
                <li className="flex min-w-0 items-center gap-3">
                  <GitBranch size={16} className="shrink-0 text-gold" />
                  <a
                    href={about.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all transition hover:text-gold"
                  >
                    GitHub
                  </a>
                </li>
              )}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
