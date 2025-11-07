import { currentSession, getSession } from "@workspace/auth";
import { db, tasks, Task, profiles } from "@workspace/db";
import { and, asc, eq, gte, lt, or } from "drizzle-orm";
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

export async function getCompletedTasksForMiles(
  userId: string
): Promise<CompletedTasksByDate[]> {
  const session = await getSession();
  const myId = session && session.user.id;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // 他人のタスクを取得する場合、公開設定を確認
  if (userId !== myId) {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    // 公開設定が false の場合は空配列を返す
    if (!profile || !profile.tasksPublic) {
      return [];
    }
  }

  const completedTasks = await db.query.tasks.findMany({
    where: and(
      eq(tasks.userId, userId),
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

export async function getTasksByUserId(userId: string): Promise<Task[]> {
  // プロフィールの tasksPublic を確認
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, userId),
  });

  // 公開設定が false の場合は空配列を返す
  if (!profile || !profile.tasksPublic) {
    return [];
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return db.query.tasks.findMany({
    where: and(
      eq(tasks.userId, userId),
      or(
        eq(tasks.completed, false),
        and(eq(tasks.completed, true), gte(tasks.completedAt, thirtyDaysAgo))
      )
    ),
    orderBy: asc(tasks.index),
  });
}

/**
 * 昨日(00:00〜24:00 JST)に完了したタスクを取得
 * 結果は UTC の Date でクエリ（DBはUTC前提）
 */
export async function getYesterdayCompletedTasks(): Promise<Task[]> {
  const DAY_MS = 86_400_000;
  const JST_OFFSET = 9 * 60 * 60 * 1000;

  // JSTの今日の0時(=UTC起点で丸め)を出す
  const nowMs = Date.now();
  const todayJstMidnightMs = Math.floor((nowMs + JST_OFFSET) / DAY_MS) * DAY_MS;

  // 昨日のJST 00:00 をUTCに直した時刻、[start, end) の範囲を作る
  const startUtc = new Date(todayJstMidnightMs - JST_OFFSET - DAY_MS); // 昨日 00:00 JST
  const endUtc = new Date(startUtc.getTime() + DAY_MS); // 今日 00:00 JST (独占上限)

  return db.query.tasks.findMany({
    where: and(
      eq(tasks.completed, true),
      gte(tasks.completedAt, startUtc),
      lt(tasks.completedAt, endUtc) // 半開区間で安全
    ),
    orderBy: asc(tasks.completedAt),
  });
}
