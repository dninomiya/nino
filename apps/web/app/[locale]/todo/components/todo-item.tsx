"use client";

import { completeTask, uncompleteTask, updateTask } from "@/actions/task";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Task } from "@workspace/db";
import { useEffect, useOptimistic, useState, useTransition } from "react";
import { useDebounce, useDebouncedCallback } from "use-debounce";

export function TodoItem({ item }: { item: Task }) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(item.title);
  const [optimisticItem, updateOptimisticItem] = useOptimistic(
    item,
    (state, action: { completed?: boolean; title?: string }) => {
      return {
        ...state,
        completed: action.completed ?? state.completed,
        title: action.title ?? state.title,
      };
    }
  );

  const [debouncedTitle] = useDebounce(title, 500);

  useEffect(() => {
    updateTask(item.id, { title: debouncedTitle });
  }, [debouncedTitle]);

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        className={cn(optimisticItem.completed ? "opacity-10" : "")}
        checked={optimisticItem.completed}
        onCheckedChange={(checked) => {
          if (isPending) return;

          startTransition(async () => {
            updateOptimisticItem({ completed: checked as boolean });
            if (checked) {
              await completeTask(item.id);
            } else {
              await uncompleteTask(item.id);
            }
          });
        }}
      />
      <Input
        type="text"
        name="title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        className={cn(
          "flex-1 bg-transparent! border-none shadow-none",
          optimisticItem.completed
            ? "line-through text-muted-foreground/50"
            : ""
        )}
      />
      <span className="text-xs text-muted-foreground">{optimisticItem.sp}</span>
    </div>
  );
}
