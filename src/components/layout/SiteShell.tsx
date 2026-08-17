"use client";

import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AmbientCursor, ScrollProgress } from "@/components/ui/Motion";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <AmbientCursor />
      <SiteNav />
      <div className="min-h-screen">{children}</div>
      <SiteFooter />
    </>
  );
}
