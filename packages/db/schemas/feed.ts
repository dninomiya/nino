import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { id, timestamps } from "../util";

export const feedItems = sqliteTable(
  "feed_items",
  {
    id,
    url: text("url").notNull(),
    date: integer("date", { mode: "timestamp_ms" }).notNull(),
    title: text("title").notNull(),
    type: text("type").notNull(),
    source: text("source").notNull(),
    content: text("content"),
    thumbnail: text("thumbnail"),
    rawXml: text("raw_xml"),
    rssUrl: text("rss_url"),
    summary: text("summary"),
    tags: text("tags"), // JSON string
    ...timestamps,
  },
  (t) => [uniqueIndex("feed_items_url_date_unique").on(t.url, t.date)]
);
