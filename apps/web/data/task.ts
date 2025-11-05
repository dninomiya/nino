import { currentSession } from "@workspace/auth";
import { db, tasks, Task } from "@workspace/db";
import { and, asc, eq, gte, or } from "drizzle-orm";
import "server-only";

export async function getMyTasks() {
  const session = await currentSession();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return db.query.tasks.findMany({
    where: and(
      eq(tasks.userId, session.user.id),
      or(
        eq(tasks.completed, false),
        and(eq(tasks.completed, true), gte(tasks.completedAt, thirtyDaysAgo))
      )
    ),
    orderBy: asc(tasks.index),
  });
}

export type CompletedTasksByDate = {
  date: string; // YYYY-MM-DD形式
  sp: number;
  tasks: Array<{ title: string; sp: number | null }>;
};

export async function getCompletedTasksForMiles(): Promise<
  CompletedTasksByDate[]
> {
  const session = await currentSession();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const completedTasks = await db.query.tasks.findMany({
    where: and(
      eq(tasks.userId, session.user.id),
      eq(tasks.completed, true),
      gte(tasks.completedAt, thirtyDaysAgo)
    ),
    orderBy: asc(tasks.completedAt),
  });

  // 日付ごとにグループ化
  const tasksByDate = new Map<string, Task[]>();
  for (const task of completedTasks) {
    if (!task.completedAt) continue;
    const date = new Date(task.completedAt);
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    if (!tasksByDate.has(dateKey)) {
      tasksByDate.set(dateKey, []);
    }
    tasksByDate.get(dateKey)!.push(task);
  }

  // 日付ごとにSP集計
  const result: CompletedTasksByDate[] = [];
  for (const [date, tasks] of tasksByDate.entries()) {
    const sp = tasks.reduce((sum, task) => sum + (task.sp ?? 0), 0);
    result.push({
      date,
      sp,
      tasks: tasks.map((task) => ({
        title: task.title,
        sp: task.sp,
      })),
    });
  }

  return result.sort((a, b) => a.date.localeCompare(b.date));
}
