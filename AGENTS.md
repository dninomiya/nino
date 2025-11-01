# Agents

## 実装フロー

1. Drizzle スキーマの更新 /packages/db/schemas/
2. /packages/db でマイグレーション
3. /packages/db/types/ にDrizzleスキーマを使って型を定義
4. /packages/db/zod/ にDrizzleスキーマを使ってZodスキーマを定義
5. 各アプリケーションで使用