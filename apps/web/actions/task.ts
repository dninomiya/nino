"use server";

import { currentSession } from "@workspace/auth";
import { db, tasks } from "@workspace/db";
import { and, desc, eq } from "drizzle-orm";
import { generateKeyBetween } from "fractional-indexing";
import { updateTag } from "next/cache";

export async function addTask(formData: FormData) {
  const session = await currentSession();
  const title = formData.get("title") as string;

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

  await db.insert(tasks).values({
    title,
    userId: session.user.id,
    sp: 1,
    completed: false,
    index: newIndex,
  });

  updateTag(`tasks:${session.user.id}`);
}

export async function updateTask(formData: FormData) {
  const session = await currentSession();
  const uid = session.user.id;
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const completed = formData.get("completed") as string;

  await db
    .update(tasks)
    .set({
      title,
      completed: completed === "true",
    })
    .where(and(eq(tasks.id, id), eq(tasks.userId, uid)));

  updateTag(`tasks:${uid}`);
}

export async function completeTask(id: string) {
  const session = await currentSession();
  const uid = session.user.id;
  await db
    .update(tasks)
    .set({ completed: true })
    .where(and(eq(tasks.id, id), eq(tasks.userId, uid)));
  updateTag(`tasks:${uid}`);
}

export async function uncompleteTask(id: string) {
  const session = await currentSession();
  const uid = session.user.id;
  await db
    .update(tasks)
    .set({ completed: false })
    .where(and(eq(tasks.id, id), eq(tasks.userId, uid)));
  updateTag(`tasks:${uid}`);
}

export async function deleteTask(id: string) {
  const session = await currentSession();
  const uid = session.user.id;
  await db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, uid)));
  updateTag(`tasks:${uid}`);
}
