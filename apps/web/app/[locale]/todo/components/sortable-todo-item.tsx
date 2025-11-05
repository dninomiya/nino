"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TodoItem } from "./todo-item";
import { GripVertical } from "lucide-react";

export function SortableTodoItem({
  item,
}: {
  item: { id: string; title: string; completed: boolean };
}) {
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
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        aria-label="ドラッグして並び替え"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex-1">
        <TodoItem item={item} />
      </div>
    </div>
  );
}

