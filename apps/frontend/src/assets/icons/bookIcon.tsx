import React from 'react';

export default function BookIcon() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-5"
      viewBox="0 0 400 400"
      fill="none"
    >
      <defs>
        <pattern
          id="bookPattern"
          x="0"
          y="0"
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="5"
            y="5"
            width="20"
            height="20"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#bookPattern)" />
    </svg>
  );
}
