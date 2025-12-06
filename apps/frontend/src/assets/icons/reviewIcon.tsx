import React from 'react';

export default function ReviewIcon() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-5"
      viewBox="0 0 400 400"
      fill="none"
    >
      <defs>
        <pattern
          id="review-pattern"
          x="0"
          y="0"
          width="45"
          height="45"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="15"
            y="15"
            width="15"
            height="12"
            rx="2"
            fill="currentColor"
            opacity="0.3"
          />
          <circle cx="18" cy="21" r="1.5" fill="currentColor" opacity="0.5" />
          <circle cx="22.5" cy="21" r="1.5" fill="currentColor" opacity="0.5" />
          <circle cx="27" cy="21" r="1.5" fill="currentColor" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#review-pattern)" />
    </svg>
  );
}
