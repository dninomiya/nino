"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQueryState } from "nuqs";

export default function SearchParamsButton({
  queryKey,
  value,
  children,
  ...props
}: {
  queryKey: string;
  value: string;
} & React.ComponentProps<typeof Button>) {
  const [currentValue, setSearchParams] = useQueryState(queryKey);

  return (
    <Button
      {...props}
      className={cn(props.className, currentValue === value && "bg-accent")}
      onClick={() =>
        setSearchParams(value, {
          shallow: false,
        })
      }
    >
      {children}
    </Button>
  );
}
