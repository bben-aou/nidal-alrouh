'use client';

interface ResourceProgressProps {
  progress: number;
}

export function ResourceProgress({
  progress,
}: Readonly<ResourceProgressProps>) {
  if (progress === undefined || progress <= 0) return null;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
