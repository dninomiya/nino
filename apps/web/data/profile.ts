import { getSession } from "@workspace/auth";
import { db, Profile, profiles } from "@workspace/db";
import { and, desc, eq, ne } from "drizzle-orm";
import "server-only";

export async function getMyProfile(): Promise<Profile | null> {
  const session = await getSession();

  if (!session) {
    return null;
  }

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
  const session = await getSession();
  const userId = session ? session.user.id : "";

  return db.query.profiles.findMany({
    where: and(ne(profiles.userId, userId), eq(profiles.tasksPublic, true)),
    orderBy: desc(profiles.lastTaskCompletedAt),
    limit: 3,
  });
}
