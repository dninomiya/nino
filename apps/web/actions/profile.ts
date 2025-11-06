"use server";

import { currentSession } from "@workspace/auth";
import { db, profiles, NewProfile } from "@workspace/db";
import { profileFormSchema, ProfileFormSchema } from "@workspace/db/zod";
import { uploadImage, deleteImage } from "@workspace/storage";
import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { nanoid } from "nanoid";

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

  // アバター処理
  let avatarUrl = validatedData.avatar || null;

  // イメージが空の場合、既存の画像を削除
  if (!validatedData.avatar && existingProfile?.avatar) {
    const existingAvatar = existingProfile.avatar;
    if (existingAvatar.startsWith("http")) {
      // R2のURLからパスを抽出して削除
      const r2PublicUrl = process.env.R2_PUBLIC_URL;
      const r2AccountId = process.env.R2_ACCOUNT_ID;
      const r2BucketName = process.env.R2_BUCKET_NAME;

      let path: string | null = null;
      if (r2PublicUrl && existingAvatar.startsWith(r2PublicUrl + "/")) {
        path = existingAvatar.replace(r2PublicUrl + "/", "");
      } else if (
        r2AccountId &&
        r2BucketName &&
        existingAvatar.includes(`${r2BucketName}/`)
      ) {
        const splitResult = existingAvatar.split(`${r2BucketName}/`)[1];
        path = splitResult || null;
      }

      if (path) {
        try {
          await deleteImage(path);
        } catch (error) {
          console.error("Failed to delete old avatar:", error);
        }
      }
    }
  }

  // avatarがhttpで始まる場合は既存URL、それ以外はdataUrlとしてアップロード
  if (validatedData.avatar && !validatedData.avatar.startsWith("http")) {
    try {
      // dataUrlの場合のみアップロード
      const timestamp = Date.now();
      const uniqueId = nanoid(10);
      const newPath = `avatars/${userId}/${uniqueId}-${timestamp}.jpg`;
      avatarUrl = await uploadImage(validatedData.avatar, newPath);
    } catch (error) {
      console.error("Failed to upload avatar to R2:", error);
      return {
        success: false,
        error: "アバター画像のアップロードに失敗しました",
      };
    }
  }

  const profileData: Partial<NewProfile> & { userId: string } = {
    userId,
    nickname: validatedData.nickname || null,
    avatar: avatarUrl,
    tagline: validatedData.tagline || null,
    bio: validatedData.bio || null,
    links: linksJsonString,
    tasksPublic: validatedData.tasksPublic ?? false,
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

export async function updateProfileTasksPublic(tasksPublic: boolean) {
  const session = await currentSession();
  const userId = session.user.id;

  try {
    await db
      .update(profiles)
      .set({ tasksPublic })
      .where(eq(profiles.userId, userId));

    updateTag(`profiles:${userId}`);
    revalidatePath("/todo");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to update profile tasksPublic:", error);
    return {
      success: false,
      error: "設定の保存に失敗しました",
    };
  }
}
