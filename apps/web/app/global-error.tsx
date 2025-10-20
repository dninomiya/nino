"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";
import { sendDiscordWebhook } from "@workspace/discord";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Sentryに送信
    Sentry.captureException(error);

    // Discordにエラーを送信
    const sendErrorToDiscord = async () => {
      try {
        const errorMessage =
          `🚨 **グローバルエラーが発生しました**\n\n` +
          `**エラー詳細:**\n` +
          `\`\`\`\n${error.message || "Unknown error"}\n\`\`\`\n` +
          `**Digest:** ${error.digest || "No digest"}\n` +
          `**スタックトレース:**\n` +
          `\`\`\`\n${error.stack || "No stack trace available"}\n\`\`\`\n` +
          `**発生時刻:** ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`;

        await sendDiscordWebhook("log", errorMessage);
      } catch (discordError) {
        console.error("Failed to send global error to Discord:", discordError);
      }
    };

    sendErrorToDiscord();
  }, [error]);

  return (
    <html>
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
