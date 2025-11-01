import { YouTubeEmbed } from "@next/third-parties/google";
import { cn } from "@workspace/ui/lib/utils";

export function YouTubeVideo({
  videoid,
  className,
}: {
  videoid: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full [&_lite-youtube]:aspect-video [&_lite-youtube]:overflow-hidden [&_lite-youtube]:max-w-full! [&_lite-youtube]:rounded-md [&_lite-youtube]:border",
        className
      )}
    >
      <YouTubeEmbed videoid={videoid} />
    </div>
  );
}
