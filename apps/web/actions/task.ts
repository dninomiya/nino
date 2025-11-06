"use server";

import { currentSession } from "@workspace/auth";
import { db, NewTask, tasks, profiles } from "@workspace/db";
import { and, desc, eq } from "drizzle-orm";
import { generateKeyBetween } from "fractional-indexing";
import { updateTag } from "next/cache";

export async function addTask(formData: FormData) {
  const session = await currentSession();
  const title = formData.get("title") as string;
  const sp = formData.get("sp") as string;

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
    sp: sp ? parseInt(sp) : 0,
    completed: false,
    index: newIndex,
  });

  updateTag(`tasks:${session.user.id}`);
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

export async function reorderTask(
  activeId: string,
  overId: string,
  items: Array<{ id: string; index: string }>
) {
  const session = await currentSession();
  const uid = session.user.id;

  // アクティブなアイテムと移動先のアイテムを取得
  const activeItem = items.find((item) => item.id === activeId);
  const overItem = items.find((item) => item.id === overId);

  if (!activeItem || !overItem) return;

  // アクティブなアイテムを除外したソート済みリストを取得
  const sortedItems = [...items]
    .filter((item) => item.id !== activeId)
    .sort((a, b) => a.index.localeCompare(b.index));

  // 移動先のインデックスを取得
  const overIndex = sortedItems.findIndex((item) => item.id === overId);
  if (overIndex === -1) return;

  // 前後のアイテムを取得
  const prevItem = overIndex > 0 ? sortedItems[overIndex - 1] : null;
  const nextItem =
    overIndex < sortedItems.length - 1 ? sortedItems[overIndex + 1] : null;

  // 新しいインデックスを生成
  const newIndex = generateKeyBetween(
    prevItem?.index ?? null,
    nextItem?.index ?? null
  );

  // データベースを更新
  await db
    .update(tasks)
    .set({ index: newIndex })
    .where(and(eq(tasks.id, activeId), eq(tasks.userId, uid)));

  updateTag(`tasks:${uid}`);
}
