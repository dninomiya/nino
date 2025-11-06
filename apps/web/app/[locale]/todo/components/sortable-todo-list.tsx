"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useOptimistic, useTransition } from "react";
import { reorderTask } from "@/actions/task";
import { SortableTodoItem } from "./sortable-todo-item";
import { Task } from "@workspace/db";

export function SortableTodoList({
  tasks: initialTasks,
  settings,
}: {
  tasks: Task[];
  settings: { soundEnabled: boolean; tasksPublic: boolean };
}) {
  // クライアントサイドでソート: 未完了タスクを先に、完了タスクを後に
  const sortedTasks = [...initialTasks].sort((a, b) => {
    // 未完了タスクを先に
    if (!a.completed && b.completed) return -1;
    if (a.completed && !b.completed) return 1;
    // 同じ完了状態の場合は元の順序を維持
    return 0;
  });

  const [isPending, startTransition] = useTransition();
  const [optimisticTasks, updateOptimisticTasks] = useOptimistic(
    sortedTasks,
    (state, action: { tasks: Task[] }) => action.tasks
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = optimisticTasks.findIndex(
        (task) => task.id === active.id
      );
      const newIndex = optimisticTasks.findIndex((task) => task.id === over.id);

      const newTasks = arrayMove(optimisticTasks, oldIndex, newIndex);

      // サーバーに保存
      startTransition(async () => {
        // オプティミスティック更新
        updateOptimisticTasks({ tasks: newTasks });

        await reorderTask(
          active.id as string,
          over.id as string,
          optimisticTasks.map((task) => ({ id: task.id, index: task.index }))
        );
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={optimisticTasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div>
          {optimisticTasks.map((task) => (
            <SortableTodoItem
              key={task.id}
              item={task}
              soundEnabled={settings.soundEnabled}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
