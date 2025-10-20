# Database Package

このパッケージは、Drizzle ORMを使用したデータベーススキーマと型定義を提供します。

## 構造

```
/packages/db/
├── schemas/          # Drizzleスキーマ定義
│   ├── auth.ts       # 認証関連テーブル
│   ├── feed.ts       # フィード関連テーブル
│   └── status.ts     # ステータス関連テーブル
├── types/            # 型定義（drizzle-zodの$inferSelect使用）
├── zod/              # Zodスキーマ（drizzle-zodのcreateInsertSchema使用）
└── index.ts          # メインエクスポート
```

## 使用方法

### 1. スキーマの更新

スキーマファイル（`/packages/db/schemas/`）を編集します。

### 2. マイグレーションの生成・実行

```bash
cd /packages/db
pnpm gm  # generate + migrate
```

### 3. 各アプリケーションでの使用

```typescript
// 型の使用
import { User, NewUser, FeedItem } from "@workspace/db";

// Zodスキーマの使用
import { insertUserSchema, selectUserSchema } from "@workspace/db";

// データベース接続の使用
import { db, users, feedItems } from "@workspace/db";

// データの挿入（バリデーション付き）
const userData = insertUserSchema.parse({
  name: "John Doe",
  email: "john@example.com",
});

const newUser = await db.insert(users).values(userData);
```

## 利用可能なスクリプト

- `pnpm dev` - ローカル開発用データベース
- `pnpm generate` - マイグレーションファイル生成
- `pnpm migrate` - マイグレーション実行
- `pnpm gm` - 生成 + マイグレーション
- `pnpm studio` - Drizzle Studio起動

## 技術的な詳細

- **型定義**: Drizzle ORMの `$inferSelect` と `$inferInsert` を使用して型を自動生成
- **Zodスキーマ**: `drizzle-zod` の `createInsertSchema` と `createSelectSchema` を使用してバリデーションスキーマを自動生成
- **自動更新**: スキーマを変更すると、TypeScriptの型システムにより自動的に型とZodスキーマが更新されます

## 注意事項

- `types/` と `zod/` ディレクトリ内のファイルは自動生成されるため、手動で編集しないでください
- スキーマを変更すると、TypeScriptの型システムにより自動的に型とZodスキーマが更新されます
