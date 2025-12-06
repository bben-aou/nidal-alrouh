import React from 'react';

export default function StarIcon() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-5"
      viewBox="0 0 400 400"
      fill="none"
    >
      <defs>
        <pattern
          id="star-pattern"
          x="0"
          y="0"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <polygon
            points="30,10 35,25 50,25 38,35 43,50 30,40 17,50 22,35 10,25 25,25"
            fill="currentColor"
            opacity="0.3"
            transform="scale(0.4) translate(25, 25)"
          />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#star-pattern)" />
    </svg>
  );
}
