"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, GitBranch } from "lucide-react";

export function Hero({ githubUrl }: { githubUrl?: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const glow = useTransform(scrollYProgress, [0, 1], [0.9, 0.2]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <motion.div style={{ scale }} className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(198,161,91,0.22),transparent_58%)]" />
        <motion.div
          style={{ opacity: glow }}
          className="absolute top-1/2 left-1/2 h-[55vmax] w-[55vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl"
        />
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
        <div className="absolute -right-16 bottom-20 h-80 w-80 rounded-full bg-bronze/40 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[color:var(--ink)] to-transparent" />
      </motion.div>

      <motion.div
        style={{ y, opacity }}
        className="section-pad relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center pt-24 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-gold/10 blur-2xl" />
          <Image
            src="/brand/logo-transparent.png"
            alt="Thanda Manuel — Purpose · Disciple · Legacy"
            width={720}
            height={300}
            priority
            className="logo-shimmer mx-auto h-auto w-[min(88vw,420px)] object-contain drop-shadow-[0_25px_70px_rgba(198,161,91,0.35)]"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="mt-8 text-[10px] tracking-[0.28em] text-gold uppercase sm:mt-10 sm:text-[11px] sm:tracking-[0.42em]"
        >
          Full-Stack Developer · Cape Town
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.85 }}
          className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.2rem,10vw,6rem)] leading-[0.95] tracking-[0.04em] text-cream sm:mt-4 sm:tracking-[0.06em]"
        >
          Build with
          <span className="block gold-text">purpose.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-cream-dim md:text-lg"
        >
          7+ live production apps with TypeScript and modern frameworks —
          crafted for business clarity and lasting legacy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.7 }}
          className="mt-8 flex w-full max-w-md flex-col items-stretch gap-3 px-1 sm:mt-10 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4"
        >
          <Link
            href="#work"
            className="group relative overflow-hidden bg-gold px-8 py-3.5 text-center text-xs font-semibold tracking-[0.22em] text-on-gold uppercase"
          >
            <span className="relative z-10">View Work</span>
            <span className="absolute inset-0 translate-y-full bg-gold-bright transition duration-300 group-hover:translate-y-0" />
          </Link>
          <Link
            href="/contact"
            className="border border-gold/45 px-8 py-3.5 text-center text-xs tracking-[0.22em] text-gold uppercase transition hover:bg-gold/10 hover:shadow-[0_0_40px_rgba(198,161,91,0.15)]"
          >
            Let&apos;s Talk
          </Link>
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-gold/45 px-8 py-3.5 text-center text-xs tracking-[0.22em] text-gold uppercase transition hover:bg-gold/10"
            >
              <GitBranch size={14} />
              GitHub
            </a>
          )}
        </motion.div>

        <motion.a
          href="#work"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 inline-flex flex-col items-center gap-2 text-[10px] tracking-[0.4em] text-cream-dim uppercase"
        >
          Discover
          <ArrowDown className="animate-bounce text-gold" size={16} />
        </motion.a>
      </motion.div>
    </section>
  );
}
