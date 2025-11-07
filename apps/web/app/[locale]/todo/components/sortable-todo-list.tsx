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
import { useId, useMemo, useOptimistic, useTransition } from "react";
import { updateTask } from "@/actions/task";
import { SortableTodoItem } from "./sortable-todo-item";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Task } from "@workspace/db";
import { generateKeyBetween } from "fractional-indexing";

export function SortableTodoList({
  tasks: initialTasks,
  settings,
}: {
  tasks: Task[];
  settings: { soundEnabled: boolean };
}) {
  const sortedTasks = useMemo(() => {
    const incompleteTasks = initialTasks.filter((task) => !task.completed);
    const completedTasks = initialTasks.filter((task) => task.completed);
    return [...incompleteTasks, ...completedTasks];
  }, [initialTasks]);

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

        // 移動先の前後のタスクを取得
        const prevTask = newIndex > 0 ? newTasks[newIndex - 1] : null;
        const nextTask =
          newIndex < newTasks.length - 1 ? newTasks[newIndex + 1] : null;

        // 新しい index を計算
        const newIndexValue = generateKeyBetween(
          prevTask?.index ?? null,
          nextTask?.index ?? null
        );

        // updateTask で更新
        await updateTask(active.id as string, { index: newIndexValue });
      });
    }
  }

  const id = useId();

  return (
    <DndContext
      id={id}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
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
