import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql/web";
import * as auth from "./schemas/auth";
import * as feed from "./schemas/feed";
import * as status from "./schemas/status";

export const db = drizzle({
  connection: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  schema: {
    ...auth,
    ...feed,
    ...status,
  },
});

// スキーマのエクスポート
export * from "./schemas/auth";
export * from "./schemas/feed";
export * from "./schemas/status";

// 生成された型のエクスポート
export * from "./types";

// 生成されたZodスキーマのエクスポート
export * from "./zod";

// 重複する型の明示的エクスポート
export type { NormalizedStatus } from "./types";
