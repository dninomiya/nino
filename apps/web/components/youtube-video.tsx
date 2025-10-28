"use client";

import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface YouTubeVideoProps {
  url: string;
  title: string;
  thumbnail?: string;
}

export function YouTubeVideo({ url }: YouTubeVideoProps) {
  return (
    <div className="aspect-video overflow-hidden rounded-md border">
      <ReactPlayer src={url} width="100%" height="100%" controls />
    </div>
  );
}
