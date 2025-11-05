import { getMyTasks } from "@/data/task";
import { TaskForm } from "./components/task-form";
import { SortableTodoList } from "./components/sortable-todo-list";
import { cacheTag } from "next/cache";
import { currentSession } from "@workspace/auth";
import { Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RecencyDate } from "@/components/recency-date";
import { Miles } from "./components/miles";

export default function TodoPage() {
  return (
    <div className="h-dvh flex flex-col light bg-brand">
      <div className="grid divide-x divide-dashed divide-black/20 grid-cols-4 flex-1 -mr-px -mb-px">
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
      <div className="h-14 border-t flex items-center justify-center">
        <p>aa</p>
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

  const session = await currentSession();
  const user = session.user;

  return (
    <div className="space-y-2 flex flex-col p-6 relative">
      <div className="flex items-center gap-2">
        <Avatar className="rounded-md border border-black/10 size-9">
          {user.image && <AvatarImage src={user.image} />}
          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1.5 *:leading-none">
          <h2 className="font-bold text-sm text-zinc-700">{user.name}</h2>
          <p className="text-xs text-muted-foreground">
            <RecencyDate date={user.createdAt} locale="ja" />
          </p>
        </div>
      </div>
      <div className="flex-1">
        <SortableTodoList tasks={tasks} />
        <TaskForm />
      </div>
      <Miles />
    </div>
  );
}
