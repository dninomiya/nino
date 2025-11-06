"use server";

import { currentSession } from "@workspace/auth";
import { db, profiles, NewProfile } from "@workspace/db";
import { profileFormSchema, ProfileFormSchema } from "@workspace/db/zod";
import { uploadImage, updateImage } from "@workspace/storage";
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

  // avatarがdataURLの場合、R2にアップロード
  let avatarUrl = validatedData.avatar || null;
  if (validatedData.avatar && validatedData.avatar.startsWith("data:image/")) {
    try {
      // 既存のアバターがある場合、R2のURLかどうかをチェック
      const existingAvatar = existingProfile?.avatar;
      let oldPath: string | null = null;

      if (existingAvatar && existingAvatar.startsWith("https://")) {
        // R2の公開URLかどうかをチェック（R2_PUBLIC_URLまたはデフォルトのR2 URLパターン）
        const r2PublicUrl = process.env.R2_PUBLIC_URL;
        const r2AccountId = process.env.R2_ACCOUNT_ID;
        const r2BucketName = process.env.R2_BUCKET_NAME;

        if (
          r2PublicUrl &&
          existingAvatar.startsWith(r2PublicUrl + "/avatars/")
        ) {
          // カスタム公開URLの場合
          oldPath = existingAvatar.replace(r2PublicUrl + "/", "");
        } else if (
          r2AccountId &&
          r2BucketName &&
          existingAvatar.includes(
            `${r2AccountId}.r2.cloudflarestorage.com/${r2BucketName}/avatars/`
          )
        ) {
          // デフォルトのR2 URLの場合
          oldPath = existingAvatar.split(`${r2BucketName}/`)[1];
        }
      }

      // 新しいパスを生成
      const timestamp = Date.now();
      const uniqueId = nanoid(10);
      const newPath = `avatars/${userId}/${uniqueId}-${timestamp}.jpg`;

      // アップロードまたは更新
      if (oldPath) {
        avatarUrl = await updateImage(validatedData.avatar, oldPath, newPath);
      } else {
        avatarUrl = await uploadImage(validatedData.avatar, newPath);
      }
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
