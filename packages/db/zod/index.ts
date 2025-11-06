import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as authSchema from "../schemas/auth";
import * as feedSchema from "../schemas/feed";
import * as statusSchema from "../schemas/status";
import * as taskSchema from "../schemas/task";
import * as profileSchema from "../schemas/profile";
import * as todoSettingsSchema from "../schemas/todo-settings";
import { z } from "zod";

// Auth Schema Zod Schemas
export const insertUserSchema = createInsertSchema(authSchema.users);
export const selectUserSchema = createSelectSchema(authSchema.users);

export const insertSessionSchema = createInsertSchema(authSchema.sessions);
export const selectSessionSchema = createSelectSchema(authSchema.sessions);

export const insertAccountSchema = createInsertSchema(authSchema.accounts);
export const selectAccountSchema = createSelectSchema(authSchema.accounts);

export const insertVerificationSchema = createInsertSchema(
  authSchema.verifications
);
export const selectVerificationSchema = createSelectSchema(
  authSchema.verifications
);

// Feed Schema Zod Schemas
export const insertFeedItemSchema = createInsertSchema(feedSchema.feedItems);
export const selectFeedItemSchema = createSelectSchema(feedSchema.feedItems);

// Status Schema Zod Schemas
export const insertStatusEventSchema = createInsertSchema(
  statusSchema.statusEvents
);
export const selectStatusEventSchema = createSelectSchema(
  statusSchema.statusEvents
);

// Task Schema Zod Schemas
export const insertTaskSchema = createInsertSchema(taskSchema.tasks);
export const selectTaskSchema = createSelectSchema(taskSchema.tasks);

// Profile Schema Zod Schemas
export const insertProfileSchema = createInsertSchema(profileSchema.profiles);
export const selectProfileSchema = createSelectSchema(profileSchema.profiles);

// Todo Settings Schema Zod Schemas
export const insertTodoSettingsSchema = createInsertSchema(
  todoSettingsSchema.todoSettings
);
export const selectTodoSettingsSchema = createSelectSchema(
  todoSettingsSchema.todoSettings
);

// カスタムバリデーションスキーマ
export const normalizedStatusSchema = z.enum([
  "normal",
  "degraded",
  "partial",
  "major",
  "maintenance",
  "unknown",
]);

// Profile Form Schema (UI向け - linksは配列)
export const profileFormSchema = z.object({
  nickname: z.string().optional(),
  avatar: z
    .string()
    .url("有効なURLを入力してください")
    .optional()
    .or(z.literal("")),
  tagline: z.string().optional(),
  bio: z.string().optional(),
  links: z.array(
    z
      .string()
      .trim()
      .min(1, "URLを入力してください")
      .url("有効なURLを入力してください")
  ),
  tasksPublic: z.boolean().optional(),
});

// バリデーション用のスキーマ（オプショナルフィールドを追加）
export const updateUserSchema = insertUserSchema.partial();
export const updateSessionSchema = insertSessionSchema.partial();
export const updateAccountSchema = insertAccountSchema.partial();
export const updateVerificationSchema = insertVerificationSchema.partial();
export const updateFeedItemSchema = insertFeedItemSchema.partial();
export const updateStatusEventSchema = insertStatusEventSchema.partial();
export const updateTaskSchema = insertTaskSchema.partial();
export const updateProfileSchema = insertProfileSchema.partial();
export const updateTodoSettingsSchema = insertTodoSettingsSchema.partial();

// 型エクスポート
export type InsertUserSchema = z.infer<typeof insertUserSchema>;
export type SelectUserSchema = z.infer<typeof selectUserSchema>;
export type InsertSessionSchema = z.infer<typeof insertSessionSchema>;
export type SelectSessionSchema = z.infer<typeof selectSessionSchema>;
export type InsertAccountSchema = z.infer<typeof insertAccountSchema>;
export type SelectAccountSchema = z.infer<typeof selectAccountSchema>;
export type InsertVerificationSchema = z.infer<typeof insertVerificationSchema>;
export type SelectVerificationSchema = z.infer<typeof selectVerificationSchema>;
export type InsertFeedItemSchema = z.infer<typeof insertFeedItemSchema>;
export type SelectFeedItemSchema = z.infer<typeof selectFeedItemSchema>;
export type InsertStatusEventSchema = z.infer<typeof insertStatusEventSchema>;
export type SelectStatusEventSchema = z.infer<typeof selectStatusEventSchema>;
export type InsertTaskSchema = z.infer<typeof insertTaskSchema>;
export type SelectTaskSchema = z.infer<typeof selectTaskSchema>;
export type InsertProfileSchema = z.infer<typeof insertProfileSchema>;
export type SelectProfileSchema = z.infer<typeof selectProfileSchema>;
export type InsertTodoSettingsSchema = z.infer<typeof insertTodoSettingsSchema>;
export type SelectTodoSettingsSchema = z.infer<typeof selectTodoSettingsSchema>;
export type NormalizedStatusSchema = z.infer<typeof normalizedStatusSchema>;
export type ProfileFormSchema = z.infer<typeof profileFormSchema>;
