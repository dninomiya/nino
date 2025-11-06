"use server";

import { currentSession } from "@workspace/auth";
import { db, todoSettings, NewTodoSettings } from "@workspace/db";
import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";

export async function updateTodoSettings(data: {
  soundEnabled?: boolean;
}) {
  const session = await currentSession();
  const userId = session.user.id;

  // 既存の設定を取得
  const existingSettings = await db.query.todoSettings.findFirst({
    where: eq(todoSettings.userId, userId),
  });

  const settingsData: Partial<NewTodoSettings> & { userId: string } = {
    userId,
    soundEnabled: data.soundEnabled ?? true,
  };

  try {
    if (existingSettings) {
      // 既存の設定を更新
      await db
        .update(todoSettings)
        .set(settingsData)
        .where(eq(todoSettings.userId, userId));
    } else {
      // 新規設定を作成
      await db.insert(todoSettings).values(settingsData);
    }

    updateTag(`todo-settings:${userId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to update todo settings:", error);
    return {
      success: false,
      error: "設定の保存に失敗しました",
    };
  }
}
