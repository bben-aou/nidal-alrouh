import React from 'react';

export default function VideoIcon() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-5"
      viewBox="0 0 400 400"
      fill="none"
    >
      <defs>
        <pattern
          id="videoPattern"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.3" />
          <polygon
            points="15,12 15,28 28,20"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#videoPattern)" />
    </svg>
  );
}
