import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as authSchema from "../schemas/auth";
import * as feedSchema from "../schemas/feed";
import * as statusSchema from "../schemas/status";
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
export const insertStatusLatestSchema = createInsertSchema(
  statusSchema.statusLatest
);
export const selectStatusLatestSchema = createSelectSchema(
  statusSchema.statusLatest
);

export const insertStatusEventSchema = createInsertSchema(
  statusSchema.statusEvents
);
export const selectStatusEventSchema = createSelectSchema(
  statusSchema.statusEvents
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

// バリデーション用のスキーマ（オプショナルフィールドを追加）
export const updateUserSchema = insertUserSchema.partial();
export const updateSessionSchema = insertSessionSchema.partial();
export const updateAccountSchema = insertAccountSchema.partial();
export const updateVerificationSchema = insertVerificationSchema.partial();
export const updateFeedItemSchema = insertFeedItemSchema.partial();
export const updateStatusLatestSchema = insertStatusLatestSchema.partial();
export const updateStatusEventSchema = insertStatusEventSchema.partial();

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
export type InsertStatusLatestSchema = z.infer<typeof insertStatusLatestSchema>;
export type SelectStatusLatestSchema = z.infer<typeof selectStatusLatestSchema>;
export type InsertStatusEventSchema = z.infer<typeof insertStatusEventSchema>;
export type SelectStatusEventSchema = z.infer<typeof selectStatusEventSchema>;
export type NormalizedStatusSchema = z.infer<typeof normalizedStatusSchema>;
