"use client";

import { completeTask, uncompleteTask } from "@/actions/task";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useOptimistic, useTransition } from "react";

export function TodoItem({
  item,
}: {
  item: { id: string; title: string; completed: boolean };
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticItem, updateOptimisticItem] = useOptimistic(
    item,
    (state, action: { completed: boolean }) => {
      return {
        ...state,
        completed: action.completed,
      };
    }
  );

  return (
    <label className="flex items-center gap-2">
      <Checkbox
        checked={optimisticItem.completed}
        onCheckedChange={(checked) => {
          startTransition(async () => {
            if (checked) {
              await completeTask(item.id);
            } else {
              await uncompleteTask(item.id);
            }
            updateOptimisticItem({ completed: checked as boolean });
          });
        }}
      />
      <span
        className={cn(
          optimisticItem.completed ? "line-through text-muted-foreground" : ""
        )}
      >
        {item.title}
      </span>
    </label>
  );
}
