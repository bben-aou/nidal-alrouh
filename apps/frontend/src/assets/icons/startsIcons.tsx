import React from 'react';

export default function StartsIcons() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-5"
      viewBox="0 0 400 400"
      fill="none"
    >
      <defs>
        <pattern
          id="dots1"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="20" cy="20" r="2" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#dots1)" />
    </svg>
  );
}
