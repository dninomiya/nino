# Agents

## 実装フロー

1. Drizzle スキーマの更新 /packages/db/schemas/
2. /packages/db でマイグレーション
3. /packages/db/types/ にDrizzleスキーマを使って型を定義
  - `export type Task = typeof taskSchema.tasks.$inferSelect;`
4. /packages/db/zod/ にDrizzleスキーマを使ってZodスキーマを定義
  - `export const insertTaskSchema = createInsertSchema(tasks, {title: ...});`
5. 各アプリケーションで使用

## Commit

- コミットメッセージは conventional commits に従う。

## Forms

- ローディング中のボタンはラベルを変更せず、横にスピナーを表示する
- プレースホルダーは「…」で終わり、例となるパターンを含める（例: +1 (123) 456-7890、sk-012345…）
- autocomplete属性と意味のあるname属性を付与し、適切なtypeやinputmodeを設定する
- メールアドレスやコード、ユーザー名などにはスペルチェックを無効にする
- 入力をブロックせず、自由入力を許可しバリデーションは後で行う
- ボタンのラベルは明確にする。「続行」ではなく「APIキーを保存」など。

## Copywriting

- エラーメッセージは解決方法まで案内する。何が問題かだけでなく、ユーザーがどうすれば直せるかまで明記する。
  - 例: 「無効なAPIキーです」ではなく、「APIキーが間違っているか期限切れです。アカウント設定で新しいキーを生成してください。」のように、コピーやボタン・リンクがユーザーに学びや具体的なアクションを示すようにする。
- メッセージは前向きな言葉を基本とし、エラーも含めてユーザーを励ます・解決につながる表現にする。
  - 例: 「デプロイに失敗しました」ではなく、「問題が発生しました。再試行するかサポートにご連絡ください。」のように案内する。

## Content & Accessibility

- すべての状態を設計する。空、疎、密、エラー状態。
- アイコンのみのボタンには、わかりやすい aria-label を付ける

## Zod

- 文字列を必須入力にする場合、.trim().min(1, "...") を使用する。