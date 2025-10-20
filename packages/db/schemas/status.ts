import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { id, timestamps } from "../util";

// 最新状態テーブル
export const statusLatest = sqliteTable(
  "status_latest",
  {
    id,
    provider: text("provider").notNull(),
    status: text("status").notNull(), // normal | degraded | partial | major | maintenance | unknown
    description: text("description"),
    raw: text("raw"),
    ...timestamps,
  },
  (table) => [uniqueIndex("status_latest_provider_unique").on(table.provider)]
);

// 変更履歴イベントテーブル
export const statusEvents = sqliteTable("status_events", {
  id,
  provider: text("provider").notNull(),
  status: text("status").notNull(), // 正規化後の状態
  title: text("title"), // フィードのタイトル等
  description: text("description"), // 要約や詳細
  link: text("link"), // 参照先URL
  raw: text("raw"), // 取得した生データ(JSON文字列)
  occurredAt: integer("occurred_at", { mode: "timestamp_ms" }).notNull(),
  ...timestamps,
});

export type NormalizedStatus =
  | "normal"
  | "degraded"
  | "partial"
  | "major"
  | "maintenance"
  | "unknown";
