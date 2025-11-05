import { RecencyDate } from "@/components/recency-date";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMyTasks } from "@/data/task";
import { currentSession } from "@workspace/auth";
import { cacheTag } from "next/cache";
import { Suspense } from "react";
import { Miles } from "./components/miles";
import { Pomodoro } from "./components/pomodoro";
import { SortableTodoList } from "./components/sortable-todo-list";
import { TaskForm } from "./components/task-form";

export default function TodoPage() {
  return (
    <div className="h-dvh flex flex-col bg-brand">
      <div className="grid grid-cols-4 flex-1 -mr-px -mb-px">
        <Suspense>
          <MyTaskList />
          {/* <MyTaskList />
            <MyTaskList />
            <MyTaskList />
            <MyTaskList />
            <MyTaskList />
            <MyTaskList /> */}
        </Suspense>
      </div>
      <div className="h-14 border-t border-amber-900/5 bg-linear-to-t from-amber-900/35 to-amber-900/20 flex items-center px-1 shadow-[0_-2px_6px_0_rgba(0,0,0,0.1)]">
        <Suspense>{/* <Pomodoro /> */}</Suspense>
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
  const allTasks = await getMyTasks();

  // 未完了タスク + 本日完了したタスクのみをフィルタリング
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const filteredTasks = allTasks.filter(
    (task) =>
      !task.completed ||
      (task.completed &&
        task.completedAt &&
        task.completedAt >= today &&
        task.completedAt < tomorrow)
  );

  const session = await currentSession();
  const user = session.user;

  return (
    <div className="space-y-4 flex flex-col p-4 relative border-r border-dashed border-black/20 bg-linear-to-tl from-black/5 from-5% to-20%">
      <div className="flex items-center gap-2">
        <Avatar className="rounded-md border border-black/10 size-9">
          {user.image && <AvatarImage src={user.image} />}
          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1.5 *:leading-none">
          <h2 className="font-bold text-sm text-zinc-700">{user.name}</h2>
          <p className="text-xs text-muted-foreground">ポートフォリオ作成中</p>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <SortableTodoList tasks={filteredTasks} />
      </div>
      <TaskForm />
      <Miles />
    </div>
  );
}
