"use client";

import ReactPlayer from "react-player";

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
