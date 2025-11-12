// DiscordチャンネルIDマッピング
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_API_BASE_URL = "https://discord.com/api/v10";

export const DISCORD_CHANNEL_IDS = {
  mentor: "1205818988156682250",
  activity: "1416948401282748566",
  status: "1429829323627561130",
  admin: "1208588016969318400",
  techNews: "1428317855820157058",
  members: "1404815303099023360",
} as const;

// チャンネルの型
export type DiscordChannel = keyof typeof DISCORD_CHANNEL_IDS;

// Discord Bot送信関数（型安全なチャンネル指定）
export async function sendDiscordWebhook(
  channel: DiscordChannel,
  content: string
): Promise<void> {
  if (!content) {
    throw new Error("Discord message content must not be empty");
  }

  if (content.length > 2000) {
    throw new Error(
      `Discord message content exceeds 2000 character limit (length: ${content.length})`
    );
  }

  const channelId = DISCORD_CHANNEL_IDS[channel];

  if (!channelId) {
    throw new Error(`Channel ID not configured for channel: ${channel}`);
  }

  if (!DISCORD_BOT_TOKEN) {
    throw new Error("DISCORD_BOT_TOKEN is not set");
  }

  try {
    const url = `${DISCORD_API_BASE_URL}/channels/${channelId}/messages`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to send Discord message: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      );
    }
  } catch (error) {
    console.error(`Failed to send Discord message to ${channel}:`, error);
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

  const message = header + formattedSections;

  if (message.length > 2000) {
    throw new Error(
      `Discord message exceeds 2000 character limit (length: ${message.length})`
    );
  }

  return message;
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

  const message = header + formattedUpdates;

  if (message.length > 2000) {
    throw new Error(
      `Discord message exceeds 2000 character limit (length: ${message.length})`
    );
  }

  return message;
}
