import { Skeleton } from '@/components/ui/Skeleton';

export default function BuildLoading() {
  return (
    <div className="container-brike grid gap-6 py-[var(--section-pad-y)] lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" rounded="lg" />
        <Skeleton className="h-40 w-full" rounded="lg" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" rounded="lg" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
