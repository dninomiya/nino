import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { id, timestamps } from "../util";
import { users } from "./auth";

export const profiles = sqliteTable("profiles", {
  id,
  nickname: text("nickname"),
  avatar: text("avatar"),
  tagline: text("tagline"),
  bio: text("bio"),
  links: text("links"), // JSON形式で保存
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  lastTaskCompletedAt: integer("last_task_completed_at", {
    mode: "timestamp_ms",
  }),
  tasksPublic: integer("tasks_public", { mode: "boolean" })
    .notNull()
    .default(false),
  ...timestamps,
});


