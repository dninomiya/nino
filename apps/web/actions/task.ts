"use server";

import { currentSession } from "@workspace/auth";
import { db, NewTask, tasks, profiles, taskFormSchema } from "@workspace/db";
import { and, desc, eq } from "drizzle-orm";
import { generateKeyBetween } from "fractional-indexing";
import { updateTag } from "next/cache";

export async function addTask(data: Pick<NewTask, "title"> & { sp?: string }) {
  const session = await currentSession();

  // バリデーション
  const validationResult = taskFormSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      error: "バリデーションエラーが発生しました",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const validatedData = validationResult.data;

  // 既存のタスクを取得して、最大のindexを取得
  const existingTasks = await db
    .select({ index: tasks.index })
    .from(tasks)
    .where(eq(tasks.userId, session.user.id))
    .orderBy(desc(tasks.index))
    .limit(1);

  // 最新のindexを生成（既存のタスクがない場合は最初のキーを生成）
  const maxIndex = existingTasks[0]?.index ?? null;
  const newIndex = generateKeyBetween(maxIndex, null);

  // NewTask型に準拠したデータを作成
  const taskData: NewTask = {
    title: validatedData.title,
    userId: session.user.id,
    sp: parseInt(validatedData.sp),
    completed: false,
    index: newIndex,
  };

  await db.insert(tasks).values(taskData);

  updateTag(`tasks:${session.user.id}`);

  return {
    success: true,
  };
}

export async function updateTask(id: string, newTask: Partial<NewTask>) {
  const session = await currentSession();
  const uid = session.user.id;

  await db
    .update(tasks)
    .set(newTask)
    .where(and(eq(tasks.id, id), eq(tasks.userId, uid)));

  updateTag(`tasks:${uid}`);
}

export async function completeTask(id: string) {
  const session = await currentSession();
  const uid = session.user.id;
  const now = new Date();

  await db
    .update(tasks)
    .set({ completed: true, completedAt: now })
    .where(and(eq(tasks.id, id), eq(tasks.userId, uid)));

  // プロフィールの lastTaskCompletedAt を更新
  await db
    .update(profiles)
    .set({ lastTaskCompletedAt: now })
    .where(eq(profiles.userId, uid));

  updateTag(`tasks:${uid}`);
  updateTag(`profiles:${uid}`);
}

export async function uncompleteTask(id: string) {
  const session = await currentSession();
  const uid = session.user.id;
  await db
    .update(tasks)
    .set({ completed: false, completedAt: null })
    .where(and(eq(tasks.id, id), eq(tasks.userId, uid)));
  updateTag(`tasks:${uid}`);
}

export async function deleteTask(id: string) {
  const session = await currentSession();
  const uid = session.user.id;
  await db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, uid)));
  updateTag(`tasks:${uid}`);
}
