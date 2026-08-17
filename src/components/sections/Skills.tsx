"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import type { Skill } from "@/lib/types";
import { SKILL_CATEGORIES } from "@/lib/skills-data";

export function Skills({
  skills,
  showIntro = true,
}: {
  skills: Skill[];
  showIntro?: boolean;
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, Skill[]>();
    for (const skill of skills) {
      const list = map.get(skill.category) ?? [];
      list.push(skill);
      map.set(skill.category, list);
    }

    const preferred = SKILL_CATEGORIES.filter((c) => map.has(c)).map(
      (c) => [c, map.get(c)!] as const,
    );
    const extras = Array.from(map.entries()).filter(
      ([c]) => !SKILL_CATEGORIES.includes(c as (typeof SKILL_CATEGORIES)[number]),
    );
    return [...preferred, ...extras];
  }, [skills]);

  return (
    <section className="section-pad relative pb-28 md:pb-36">
      <div className="mx-auto max-w-7xl">
        {showIntro && (
          <>
            <p className="text-xs tracking-[0.35em] text-gold uppercase">
              Capabilities
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-cream md:text-6xl">
              Skills beyond code
            </h2>
            <p className="mt-3 max-w-2xl text-cream-dim">
              Web development, marketing, sales leadership, and business
              building — the full stack of how I ship products and grow revenue.
            </p>
          </>
        )}

        <div
          className={`${showIntro ? "mt-14" : "mt-2"} grid gap-8 md:grid-cols-2`}
        >
          {grouped.length === 0 ? (
            <p className="text-cream-dim">Skills coming soon.</p>
          ) : (
            grouped.map(([category, items], gi) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: gi * 0.08 }}
                className="border border-gold/15 bg-ink-soft/30 p-6"
              >
                <h3 className="text-xs tracking-[0.22em] text-gold uppercase">
                  {category}
                </h3>
                <ul className="mt-5 max-h-[28rem] space-y-3.5 overflow-y-auto pr-1">
                  {items.map((skill) => (
                    <li key={skill.id}>
                      <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                        <span className="text-cream">{skill.name}</span>
                        <span className="shrink-0 text-cream-dim">
                          {skill.proficiency}%
                        </span>
                      </div>
                      <div className="h-1 overflow-hidden bg-cream/10">
                        <motion.div
                          className="h-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, ease: "easeOut" }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
