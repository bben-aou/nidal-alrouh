import React from 'react';

export default function SessionIcon() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-5"
      viewBox="0 0 400 400"
      fill="none"
    >
      <defs>
        <pattern
          id="sessions-pattern"
          x="0"
          y="0"
          width="50"
          height="50"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="25" cy="25" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.5" />
          <circle cx="38" cy="38" r="1" fill="currentColor" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#sessions-pattern)" />
    </svg>
  );
}
