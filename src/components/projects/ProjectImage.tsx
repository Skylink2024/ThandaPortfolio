"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/lib/types";
import { resolveProjectImage } from "@/lib/utils";

type Props = {
  project: Pick<Project, "image_url" | "live_url" | "title">;
  className?: string;
  imgClassName?: string;
};

export function ProjectImage({
  project,
  className = "",
  imgClassName = "h-full w-full object-cover",
}: Props) {
  const src = resolveProjectImage(project);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-bronze/30 via-ink-soft to-ink ${className}`}
      >
        <Image
          src="/brand/mark.png"
          alt=""
          width={72}
          height={72}
          className="h-auto w-14 object-contain opacity-70"
        />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={project.title}
      className={`${imgClassName} ${className}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
