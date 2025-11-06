import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { id, timestamps } from "../util";
import { users } from "./auth";

export const todoSettings = sqliteTable("todo_settings", {
  id,
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  soundEnabled: integer("sound_enabled", { mode: "boolean" })
    .notNull()
    .default(true),
  ...timestamps,
});

