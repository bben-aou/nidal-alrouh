import React from 'react';

export default function LinkIcon() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-5"
      viewBox="0 0 400 400"
      fill="none"
    >
      <defs>
        <pattern
          id="linkPattern"
          x="0"
          y="0"
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="5"
            y1="15"
            x2="25"
            y2="15"
            stroke="currentColor"
            strokeWidth="2"
          />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#linkPattern)" />
    </svg>
  );
}
