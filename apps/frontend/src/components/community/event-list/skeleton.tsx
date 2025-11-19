interface EventListSkeletonProps {
  count?: number;
}

export function EventListSkeleton({
  count = 3,
}: Readonly<EventListSkeletonProps>) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={`event-card-skeleton-${i}`} />
      ))}
    </>
  );
}

function EventCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
      <div className="space-y-3">
        <div className="h-6 bg-muted animate-pulse rounded-md w-3/4" />
        <div className="flex gap-2">
          <div className="h-5 bg-muted animate-pulse rounded-full w-16" />
          <div className="h-5 bg-muted animate-pulse rounded-full w-20" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-4 bg-muted animate-pulse rounded-md w-full" />
        <div className="h-4 bg-muted animate-pulse rounded-md w-5/6" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded-md w-32" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded-md w-24" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded-md w-28" />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <div className="h-10 bg-muted animate-pulse rounded-md flex-1" />
        <div className="h-10 bg-muted animate-pulse rounded-md flex-1" />
      </div>
    </div>
  );
}
