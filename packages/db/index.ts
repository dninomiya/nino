import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql/web";
import * as auth from "./schemas/auth";
import * as feed from "./schemas/feed";
import * as status from "./schemas/status";
import * as task from "./schemas/task";

export const db = drizzle({
  connection: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  schema: {
    ...auth,
    ...feed,
    ...status,
    ...task,
  },
});

// スキーマのエクスポート
export * from "./schemas/auth";
export * from "./schemas/feed";
export * from "./schemas/status";
export * from "./schemas/task";

// 生成された型のエクスポート
export * from "./types";

// 生成されたZodスキーマのエクスポート
export * from "./zod";
