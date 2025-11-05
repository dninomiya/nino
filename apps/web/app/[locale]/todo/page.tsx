import { getMyTasks } from "@/data/task";
import { TaskForm } from "./components/task-form";
import { SortableTodoList } from "./components/sortable-todo-list";
import { cacheTag } from "next/cache";
import { currentSession } from "@workspace/auth";
import { Suspense } from "react";

export default function TodoPage() {
  return (
    <div className="h-dvh light bg-brand">
      <div className="overflow-hidden">
        <div className="grid grid-cols-4 -m-px">
          <Suspense>
            <MyTaskList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function MyTaskList() {
  const session = await currentSession();
  return <TodoList userId={session.user.id} />;
}

async function TodoList({ userId }: { userId: string }) {
  "use cache: private";
  cacheTag(`tasks:${userId}`);
  const tasks = await getMyTasks();

  return (
    <div className="space-y-2 border border-dashed border-white/50 p-8">
      <h2 className="text-lg font-bold text-zinc-700">nino</h2>
      <SortableTodoList tasks={tasks} />
      <TaskForm />
    </div>
  );
}
