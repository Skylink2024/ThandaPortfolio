export function ProjectSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden border border-gold/15 bg-ink-soft/60"
        >
          <div className="skeleton aspect-[16/10]" />
          <div className="space-y-3 p-5">
            <div className="skeleton h-5 w-2/3 rounded-sm" />
            <div className="skeleton h-4 w-full rounded-sm" />
            <div className="skeleton h-4 w-4/5 rounded-sm" />
            <div className="flex gap-2 pt-2">
              <div className="skeleton h-6 w-16 rounded-sm" />
              <div className="skeleton h-6 w-20 rounded-sm" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton h-10 w-full max-w-xl rounded-sm" />
      ))}
    </div>
  );
}
