'use client';

import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player'), {
  ssr: false,
}) as any;

interface VideoPlayerProps {
  url: string;
}

export function VideoPlayer({ url }: Readonly<VideoPlayerProps>) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-lg">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls
        light
        pip
        className="absolute top-0 left-0"
      />
    </div>
  );
}
