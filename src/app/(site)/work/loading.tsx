import { Skeleton } from '@/components/ui/Skeleton';

export default function WorkLoading() {
  return (
    <div className="container-brike space-y-8 py-[var(--section-pad-y)]">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-12 w-72 max-w-full" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3] w-full" rounded="lg" />
        ))}
      </div>
    </div>
  );
}
