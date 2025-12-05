import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";
import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

export function RecencyDate({
  date,
  className,
}: {
  date: Date;
  className?: string;
}) {
  const diffInDays = differenceInDays(new Date(), date);
  const fullDate = format(date, "yyyy年M月d日 HH:mm");
  const iso = date.toISOString();

  if (diffInDays <= 3) {
    return (
      <Tooltip>
        <TooltipTrigger
          className={cn(
            "text-sm text-muted-foreground font-medium leading-none",
            className
          )}
          asChild
        >
          <time dateTime={iso}>
            {formatDistanceToNow(date, {
              addSuffix: true,
              locale: ja,
            })}
          </time>
        </TooltipTrigger>
        <TooltipContent>{fullDate}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <time
      dateTime={iso}
      className={cn(
        "text-sm text-muted-foreground font-medium leading-none",
        className
      )}
    >
      {fullDate}
    </time>
  );
}
