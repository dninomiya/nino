// このファイルは自動生成されます。手動で編集しないでください。

import * as authSchema from "../schemas/auth.js";
import * as feedSchema from "../schemas/feed.js";
import * as statusSchema from "../schemas/status.js";

// Auth Schema Types
export type User = typeof authSchema.users.$inferSelect;
export type NewUser = typeof authSchema.users.$inferInsert;
export type Session = typeof authSchema.sessions.$inferSelect;
export type NewSession = typeof authSchema.sessions.$inferInsert;
export type Account = typeof authSchema.accounts.$inferSelect;
export type NewAccount = typeof authSchema.accounts.$inferInsert;
export type Verification = typeof authSchema.verifications.$inferSelect;
export type NewVerification = typeof authSchema.verifications.$inferInsert;

// Feed Schema Types
export type FeedItem = typeof feedSchema.feedItems.$inferSelect;
export type NewFeedItem = typeof feedSchema.feedItems.$inferInsert;

// Status Schema Types
export type StatusEvent = typeof statusSchema.statusEvents.$inferSelect;
export type NewStatusEvent = typeof statusSchema.statusEvents.$inferInsert;
export type NormalizedStatus = statusSchema.NormalizedStatus;

// 全テーブルの型をまとめた型
export type AllTables = {
  users: User;
  sessions: Session;
  accounts: Account;
  verifications: Verification;
  feedItems: FeedItem;
  statusEvents: StatusEvent;
};

export type AllNewTables = {
  users: NewUser;
  sessions: NewSession;
  accounts: NewAccount;
  verifications: NewVerification;
  feedItems: NewFeedItem;
  statusEvents: NewStatusEvent;
};

// テーブル名の型
export type TableName = keyof AllTables;
