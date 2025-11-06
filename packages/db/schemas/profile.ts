import { sqliteTable, text } from "drizzle-orm/sqlite-core";
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
  ...timestamps,
});

