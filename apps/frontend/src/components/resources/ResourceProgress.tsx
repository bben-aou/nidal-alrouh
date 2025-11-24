'use client';

interface ResourceProgressProps {
  progress: number;
}

export function ResourceProgress({
  progress,
}: Readonly<ResourceProgressProps>) {
  if (progress === undefined || progress <= 0) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground/70">Progress</span>
        <span className="font-semibold text-primary">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary/50 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out rounded-full shadow-sm"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
