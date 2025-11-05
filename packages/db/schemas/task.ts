import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { id, timestamps } from "../util";
import { users } from "./auth";

export const tasks = sqliteTable("tasks", {
  id,
  title: text("title").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sp: integer("sp"),
  completed: integer("completed", { mode: "boolean" }).notNull(),
  completedAt: integer("completed_at", { mode: "timestamp_ms" }),
  index: text("index").notNull(),
  ...timestamps,
});
