"use server";

import { currentSession } from "@workspace/auth";
import { db, profiles, NewProfile } from "@workspace/db";
import { profileFormSchema, ProfileFormSchema } from "@workspace/db/zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: ProfileFormSchema) {
  const session = await currentSession();
  const userId = session.user.id;

  // バリデーション
  const validationResult = profileFormSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      error: "バリデーションエラーが発生しました",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const validatedData = validationResult.data;

  // 既存のプロフィールを取得
  const existingProfile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, userId),
  });

  // links配列をJSON文字列に変換
  const linksJsonString =
    validatedData.links.length > 0 ? JSON.stringify(validatedData.links) : null;

  const profileData: Partial<NewProfile> & { userId: string } = {
    userId,
    nickname: validatedData.nickname || null,
    avatar: validatedData.avatar || null,
    tagline: validatedData.tagline || null,
    bio: validatedData.bio || null,
    links: linksJsonString,
  };

  try {
    if (existingProfile) {
      // 既存のプロフィールを更新
      await db
        .update(profiles)
        .set(profileData)
        .where(eq(profiles.userId, userId));
    } else {
      // 新規プロフィールを作成
      await db.insert(profiles).values(profileData);
    }

    revalidatePath("/todo");

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "プロフィールの保存に失敗しました",
    };
  }
}
