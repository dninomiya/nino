import { currentSession } from "@workspace/auth";
import { db, profiles, Profile } from "@workspace/db";
import { eq } from "drizzle-orm";
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
