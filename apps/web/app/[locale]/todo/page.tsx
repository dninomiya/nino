import { ProfileEditDialog } from "@/components/profile-edit-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { getMyProfile, getProfile, getPublicProfiles } from "@/data/profile";
import { getMyTasks, getTasksByUserId } from "@/data/task";
import { getTodoSettings } from "@/data/todo-settings";
import { cacheTag } from "next/cache";
import { Suspense } from "react";
import { Lock } from "lucide-react";
import { EditTodoProfileButton } from "./components/edit-todo-profile-button";
import { Miles } from "./components/miles";
import { ProfileHoverContent } from "./components/profile-hover-content";
import { SortableTodoList } from "./components/sortable-todo-list";
import { TaskForm } from "./components/task-form";
import { TodoSettingsButton } from "./components/todo-settings-button";

export default function TodoPage() {
  return (
    <div className="h-dvh flex flex-col bg-brand overflow-hidden">
      <div className="grid grid-cols-4 flex-1 -mr-px -mb-px">
        <Suspense>
          <MyTaskList />
        </Suspense>
        <Suspense>
          <PublicTaskLists />
        </Suspense>
      </div>
      <div className="h-14 border-t border-amber-900/5 bg-linear-to-t from-amber-900/35 to-amber-900/20 flex items-center justify-end px-3 shadow-[0_-2px_6px_0_rgba(0,0,0,0.1)]">
        <Suspense>
          <TaskSettings />
        </Suspense>
      </div>
    </div>
  );
}

async function TaskSettings() {
  const settings = await getTodoSettings();

  return <TodoSettingsButton initialSettings={settings} />;
}

async function MyTaskList() {
  const profile = await getMyProfile();

  if (!profile) {
    return (
      <div className="border-r border-dashed p-4 border-black/20 bg-linear-to-tl from-black/5 from-5% to-20%">
        プロフィールを作成
        <EditTodoProfileButton />
        <Suspense>
          <ProfileEditDialog />
        </Suspense>
      </div>
    );
  }

  return (
    <>
      <TodoList userId={profile.userId} isMyTasks={true} />
      <Suspense>
        <ProfileEditDialog profile={profile} />
      </Suspense>
    </>
  );
}

async function PublicTaskLists() {
  const publicProfiles = await getPublicProfiles();

  return (
    <>
      {publicProfiles.map((profile) => (
        <Suspense key={profile.userId}>
          <TodoList userId={profile.userId} isMyTasks={false} />
        </Suspense>
      ))}
    </>
  );
}

async function TodoList({
  userId,
  isMyTasks,
}: {
  userId: string;
  isMyTasks: boolean;
}) {
  "use cache: private";
  cacheTag(`tasks:${userId}`);
  const allTasks = isMyTasks
    ? await getMyTasks()
    : await getTasksByUserId(userId);

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

  const profile = await getProfile(userId);

  if (!profile) {
    return null;
  }

  const fallbackInitial = profile?.nickname?.charAt(0) || "U";

  return (
    <div className="space-y-4 flex flex-col px-4 pb-0 pt-6 relative border-r border-dashed border-black/20 bg-linear-to-tl from-black/5 from-5% to-20%">
      <HoverCard>
        <HoverCardTrigger>
          <div className="flex items-center gap-2">
            <Avatar className="rounded-md border border-black/10 size-9">
              {profile.avatar && <AvatarImage src={profile.avatar} />}
              <AvatarFallback>{fallbackInitial}</AvatarFallback>
            </Avatar>
            <div className="space-y-1.5 *:leading-none">
              <div className="flex items-center gap-1.5">
                <h2 className="font-bold text-sm text-zinc-700">
                  {profile.nickname}
                </h2>
                {isMyTasks && !profile.tasksPublic && (
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">{profile.tagline}</p>
            </div>
          </div>
        </HoverCardTrigger>
        <ProfileHoverContent
          profile={profile}
          fallbackInitial={fallbackInitial}
        />
      </HoverCard>
      <div className="flex-1 overflow-auto py-1">
        <SortableTodoList
          tasks={filteredTasks}
          settings={{
            soundEnabled: isMyTasks
              ? (await getTodoSettings()).soundEnabled
              : false,
          }}
        />
      </div>
      <div>
        <div className="text-[10px] text-muted-foreground border-b-0 text-right border rounded-t-md w-fit ml-auto mr-2 px-1.5 py-0.5 bg-muted/40">
          {(() => {
            const totalSp = filteredTasks.reduce(
              (sum, task) => sum + (task.sp ?? 0),
              0
            );
            const completedSp = filteredTasks
              .filter((task) => task.completed)
              .reduce((sum, task) => sum + (task.sp ?? 0), 0);
            return `${completedSp} / ${totalSp} SP`;
          })()}
        </div>
        {isMyTasks && <TaskForm />}
      </div>
      {isMyTasks && <Miles />}
    </div>
  );
}
