import {
  FlipCard,
  FlipCardFront,
  FlipCardBack,
} from "@/registry/components/flip-card";
import { cn } from "@/lib/utils";

export default function Preview() {
  const cardClassName =
    "grid place-content-center rounded-xl *:size-20 shadow-xl";

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <FlipCard className="aspect-video w-40">
        <FlipCardFront className={cn(cardClassName, "bg-pink-500")}>
          <img src="/nino-line-white.svg" alt="" />
        </FlipCardFront>
        <FlipCardBack className={cn(cardClassName, "bg-sky-500")}>
          <img src="/nino-line-white.svg" alt="" />
        </FlipCardBack>
      </FlipCard>
    </div>
  );
}
