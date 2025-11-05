import { currentSession } from "@workspace/auth";
import { db, tasks } from "@workspace/db";
import { asc, eq } from "drizzle-orm";
import "server-only";

export async function getMyTasks() {
  const session = await currentSession();
  return db.query.tasks.findMany({
    where: eq(tasks.userId, session.user.id),
    orderBy: asc(tasks.index),
  });
}
