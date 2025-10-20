# Agents

## 実装フロー

1. Drizzle スキーマの更新 /packages/db/schemas/
2. /packages/db でマイグレーション
3. /packages/db/types/ にDrizzleスキーマから型を生成
4. /packages/db/zod/ にDrizzleスキーマからZodスキーマを生成
5. 各アプリケーションで使用