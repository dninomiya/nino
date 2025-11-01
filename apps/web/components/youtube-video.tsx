import { YouTubeEmbed } from "@next/third-parties/google";

interface YouTubeVideoProps {
  url: string;
  title: string;
  thumbnail?: string;
}

export function YouTubeVideo({ url }: YouTubeVideoProps) {
  const videoId = url.split("v=")[1];

  if (!videoId) {
    return null;
  }

  return (
    <div className="[&_lite-youtube]:aspect-video [&_lite-youtube]:overflow-hidden [&_lite-youtube]:max-w-full! [&_lite-youtube]:rounded-md [&_lite-youtube]:border">
      <YouTubeEmbed videoid={videoId} />
    </div>
  );
}
