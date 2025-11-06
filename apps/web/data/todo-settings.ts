import { currentSession } from "@workspace/auth";
import { db, todoSettings } from "@workspace/db";
import { eq } from "drizzle-orm";
import "server-only";

export async function getTodoSettings() {
  const session = await currentSession();
  const userId = session.user.id;

  const settings = await db.query.todoSettings.findFirst({
    where: eq(todoSettings.userId, userId),
  });

  // 設定が存在しない場合はデフォルト値を返す
  if (!settings) {
    return {
      soundEnabled: true,
    };
  }

  return {
    soundEnabled: settings.soundEnabled,
  };
}
