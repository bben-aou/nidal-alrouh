import React from 'react';

export default function BookmarkIcon() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-5"
      viewBox="0 0 400 400"
      fill="none"
    >
      <defs>
        <pattern
          id="bookmarkPattern"
          x="0"
          y="0"
          width="35"
          height="35"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M15,10 L15,25 L20,22 L25,25 L25,10 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#bookmarkPattern)" />
    </svg>
  );
}
