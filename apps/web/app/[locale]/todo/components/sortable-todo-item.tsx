"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TodoItem } from "./todo-item";
import { GripVertical } from "lucide-react";
import { Task } from "@workspace/db";

export function SortableTodoItem({ item }: { item: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center text-sm gap-2 group hover:bg-accent/20 rounded-md px-2 py-0"
    >
      <div className="flex-1">
        <TodoItem item={item} />
      </div>
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab -my-2 h-10 active:cursor-grabbing opacity-0 transition-opacity text-muted-foreground/50 group-hover:opacity-100"
        aria-label="ドラッグして並び替え"
      >
        <GripVertical className="h-4 w-4" />
      </button>
    </div>
  );
}
