"use client";

import { Button } from "@/components/ui/button";
import { useQueryState } from "nuqs";

const items = Array.from({ length: 10 }, (_, index) => index);

export function List() {
  const [id, setId] = useQueryState("id");

  return (
    <div className="flex gap-2 flex-wrap">
      {items.map((item) => (
        <Button
          variant="outline"
          key={item}
          size="icon"
          disabled={id === item.toString()}
          onClick={() => {
            setId(item.toString());
          }}
        >
          {item}
        </Button>
      ))}
    </div>
  );
}
