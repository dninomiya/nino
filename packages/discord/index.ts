// Webhook URLマッピング
export const DISCORD_WEBHOOK_URLS = {
  admin:
    "https://discord.com/api/webhooks/1208588091091193966/rBr3nn9bj1L8NUdQlMK27SL2IcaPIrC-5fjKBqj_upDvoE1TTQkOKIht8BoUmijArryL",
  techNews:
    "https://discord.com/api/webhooks/1428317946861846598/jirnzbsZFXWduVSksv-4zOyCeyxcXDifyDPoXNJvO-ahvi1ik5Qfcn6OegnkDQPvxE-d",
} as const;

// チャンネルの型
export type DiscordChannel = keyof typeof DISCORD_WEBHOOK_URLS;

// Discord Webhook送信関数（型安全なチャンネル指定）
export async function sendDiscordWebhook(
  channel: DiscordChannel,
  content: string
): Promise<void> {
  const webhookUrl = DISCORD_WEBHOOK_URLS[channel];

  if (!webhookUrl) {
    throw new Error(`Webhook URL not found for channel: ${channel}`);
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Discord webhook failed: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    console.error(`Failed to send Discord webhook to ${channel}:`, error);
    throw error;
  }
}

// Discord用メッセージフォーマッター
export function formatDiscordMessage(
  sections: Array<{
    title: string;
    summary: string;
    link: string;
    type?: string;
  }>
): string {
  if (sections.length === 0) {
    return "";
  }

  // 日本時間で現在の日時を取得
  const now = new Date();
  const jstString = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(now);

  const header = `📢 ${jstString}の最新ニュースです！\n\n`;

  const formattedSections = sections
    .map((section) => {
      // YouTube動画の場合は<>で挟まない
      const link =
        section.type === "youtube" ? section.link : `<${section.link}>`;
      return `**${section.title}**:\n${section.summary}\n${link}`;
    })
    .join("\n\n");

  return header + formattedSections;
}
