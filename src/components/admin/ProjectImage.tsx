"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/lib/types";
import { liveSitePreviewUrl } from "@/lib/utils";

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
  const primary =
    project.image_url ||
    (project.live_url ? liveSitePreviewUrl(project.live_url, 640) : null);
  const [failed, setFailed] = useState(false);

  if (!primary || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-navy-700 ${className}`}
      >
        <Image
          src="/brand/webbie.svg"
          unoptimized
          alt=""
          width={48}
          height={48}
          className="h-10 w-10 object-contain opacity-70"
        />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={primary}
      alt={project.title}
      className={`${imgClassName} ${className}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
