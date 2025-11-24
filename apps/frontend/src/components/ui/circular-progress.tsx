import React from 'react';

import { cn } from '@/lib/utils';

interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: number;
  strokeWidth?: number;
  indicatorColor?: string;
  trackColor?: string;
}

export function CircularProgress({
  value,
  size = 40,
  strokeWidth = 4,
  indicatorColor = 'text-primary',
  trackColor = 'text-primary/20',
  className,
  ...props
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center ',
        className
      )}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          className={cn('transition-all', trackColor)}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn(
            'transition-all duration-500 ease-in-out',
            indicatorColor
          )}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
    </div>
  );
}
