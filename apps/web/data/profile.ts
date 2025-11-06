import { currentSession } from "@workspace/auth";
import { db, profiles, Profile } from "@workspace/db";
import { and, desc, eq, ne } from "drizzle-orm";
import "server-only";

export async function getMyProfile(): Promise<Profile | null> {
  const session = await currentSession();

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, session.user.id),
  });

  return profile ?? null;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, userId),
  });

  return profile ?? null;
}

export async function getPublicProfiles(): Promise<Profile[]> {
  const session = await currentSession();
  const userId = session.user.id;

  return db.query.profiles.findMany({
    where: and(
      ne(profiles.userId, userId),
      eq(profiles.tasksPublic, true)
    ),
    orderBy: desc(profiles.lastTaskCompletedAt),
    limit: 3,
  });
}
