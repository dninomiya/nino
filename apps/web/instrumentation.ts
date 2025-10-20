import * as Sentry from "@sentry/nextjs";
import { sendDiscordWebhook } from "@workspace/discord";

export async function register(err: Error | undefined) {
  try {
    if (err) {
      const errorMessage =
        `🚨 **アプリケーションエラーが発生しました**\n\n` +
        `**エラー詳細:**\n` +
        `\`\`\`\n${err.message || "Unknown error"}\n\`\`\`\n` +
        `**スタックトレース:**\n` +
        `\`\`\`\n${err.stack || "No stack trace available"}\n\`\`\`\n` +
        `**発生時刻:** ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`;

      await sendDiscordWebhook("log", errorMessage);
    }
  } catch (discordError) {
    console.error("Failed to send error to Discord:", discordError);
  }

  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = async (err: Error, request: Request) => {
  // Discordにエラーを送信
  try {
    const errorMessage =
      `🚨 **リクエストエラーが発生しました**\n\n` +
      `**エラー詳細:**\n` +
      `\`\`\`\n${err.message || "Unknown error"}\n\`\`\`\n` +
      `**URL:** ${request.url || "Unknown URL"}\n` +
      `**メソッド:** ${request.method || "Unknown method"}\n` +
      `**スタックトレース:**\n` +
      `\`\`\`\n${err.stack || "No stack trace available"}\n\`\`\`\n` +
      `**発生時刻:** ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`;

    await sendDiscordWebhook("admin", errorMessage);
  } catch (discordError) {
    console.error("Failed to send request error to Discord:", discordError);
  }

  // Sentryにも送信
  return Sentry.captureException(err);
};
