import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export function Miles() {
  return (
    <div className="h-10 -mb-4 -mx-3 mt-6 grid grid-cols-30 gap-1">
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
      <div className="h-full" />
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
    </div>
  );
}

function Item() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="bg-linear-to-t from-lime-600/80 to-lime-600/40 rounded-t-full h-full" />
      </TooltipTrigger>
      <TooltipContent
        side="top"
        align="center"
        className="flex flex-col items-center"
      >
        <small className="text-xs text-muted-foreground">2025年1月12日</small>
        <span className="font-bold text-sm">16</span>
      </TooltipContent>
    </Tooltip>
  );
}
