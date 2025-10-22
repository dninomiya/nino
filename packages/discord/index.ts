// Webhook URLマッピング
export const DISCORD_WEBHOOK_URLS = {
  log: "https://discord.com/api/webhooks/1429742476792430685/tCtkI5RvrGVLA6bKnC7BtfaA8IgfOMFpkfM3ts0_yWRRhS5GUwckw8ItBSUyYM3I1dLP",
  status:
    "https://discord.com/api/webhooks/1429829353424027718/r09KQ4ePM4YRqA6I5WsbU2n5li1htKJJ1tyV2UZj6Q3KCUvinsqFmaCKU9LavepW2lZd",
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

      // summaryが空の場合はsummaryの行を表示しない
      const summaryLine = section.summary ? `\n${section.summary}` : "";

      return `**${section.title}**:${summaryLine}\n${link}`;
    })
    .join("\n\n");

  return header + formattedSections;
}

// ステータス更新用のDiscordメッセージフォーマッター
export function formatStatusDiscordMessage(
  statusUpdates: Array<{
    provider: string;
    status: string;
    summary: string;
    link?: string;
    occurredAt: Date;
  }>
): string {
  if (statusUpdates.length === 0) {
    return "";
  }

  // ステータスに応じた絵文字を取得する関数
  function getStatusEmoji(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower === "normal") return "✅";
    if (statusLower === "degraded") return "⚠️";
    if (statusLower === "partial") return "🟡";
    if (statusLower === "major") return "🚨";
    if (statusLower === "maintenance") return "🔧";
    return "❓";
  }

  // ステータスを日本語に変換する関数
  function getStatusText(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower === "normal") return "正常";
    if (statusLower === "degraded") return "低下";
    if (statusLower === "partial") return "部分障害";
    if (statusLower === "major") return "重大障害";
    if (statusLower === "maintenance") return "メンテナンス";
    return "不明";
  }

  // 日本時間で現在の日時を取得
  const now = new Date();
  const jstString = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(now);

  const header = `🚨 ${jstString} ステータス更新\n\n`;

  const formattedUpdates = statusUpdates
    .map((update) => {
      const emoji = getStatusEmoji(update.status);
      const statusText = getStatusText(update.status);
      const timeString = update.occurredAt.toLocaleString("ja-JP", {
        timeZone: "Asia/Tokyo",
        hour: "2-digit",
        minute: "2-digit",
      });

      const link = update.link ? `\n<${update.link}>` : "";

      return `**${emoji} ${statusText} ${update.provider}** (${timeString})\n${update.summary}${link}`;
    })
    .join("\n\n");

  return header + formattedUpdates;
}
