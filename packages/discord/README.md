# Discord Bot送信ユーティリティ

## 事前準備

1. Discord Botをサーバーへ招待し、対象チャンネルへ送信権限を付与する。
2. 以下の環境変数を設定する。
   ```
   DISCORD_BOT_TOKEN=...
   DISCORD_CHANNEL_LOG_ID=...
   DISCORD_CHANNEL_ACTIVITY_ID=...
   DISCORD_CHANNEL_STATUS_ID=...
   DISCORD_CHANNEL_ADMIN_ID=...
   DISCORD_CHANNEL_TECH_NEWS_ID=...
   ```
   未使用のチャンネルは空のままで構わないが、送信時に未設定だとエラーになる。

## 手動検証手順

1. ルートで `pnpm exec tsx packages/discord/scripts/send-test.ts` を実行できるよう、任意で簡易スクリプトを用意する（例を下記に記載）。
2. スクリプトを実行して指定チャンネルへテスト通知が届くことを確認する。
3. Botの同時送信時にエラーが発生しないこと、2000文字を超えるメッセージを送った際に例外がスローされることを確認する。

### send-test.ts のサンプル

```ts
import { sendDiscordWebhook } from "../index";

await sendDiscordWebhook("log", "Bot送信テストです");
```

> `tsx` が未導入の場合は `pnpm add -D tsx --filter @workspace/discord` などで追加するか、`ts-node` 等で実行してください。

