import "server-only";

import Parser from "rss-parser";
import { z } from "zod";
import { generateObject } from "ai";
import { revalidatePath } from "next/cache";
import { db } from "@workspace/db";
import {
  statusEvents,
  statusLatest,
  type NormalizedStatus,
} from "@workspace/db/schemas/status";
import { desc, eq, and, gte } from "drizzle-orm";
import { sendDiscordWebhook } from "@workspace/discord";
import { providers, type ProviderName } from "./status";

const parser = new Parser();

function normalizeStatus(text: string): NormalizedStatus {
  const t = (text || "").toLowerCase();
  if (/operational|normal|resolved|recovered|all systems/.test(t))
    return "normal";
  if (/degrad|slow|delay|latency/.test(t)) return "degraded";
  if (/partial|limited/.test(t)) return "partial";
  if (/major|outage|incident|down|unavailable/.test(t)) return "major";
  if (/maint(enance)?/.test(t)) return "maintenance";
  return "unknown";
}

type FetchedItem = {
  provider: ProviderName;
  status: NormalizedStatus;
  title?: string;
  description?: string;
  link?: string;
  occurredAt: Date;
  raw: any;
};

async function fetchProvider(provider: {
  name: ProviderName;
  rss: string;
}): Promise<FetchedItem | null> {
  try {
    const feed = await parser.parseURL(provider.rss);
    const item = feed.items?.[0];
    if (!item) return null;
    const title = item.title || "";
    const description = (item.contentSnippet ||
      item.content ||
      item.summary ||
      "") as string;
    const link = item.link || (feed.link as string) || undefined;
    const occurredAt = new Date(item.isoDate || item.pubDate || Date.now());
    const status = normalizeStatus(`${title} ${description}`);
    return {
      provider: provider.name,
      status,
      title,
      description,
      link,
      occurredAt,
      raw: item,
    };
  } catch (e) {
    console.error("fetchProvider failed", provider.name, e);
    return null;
  }
}

export async function fetchAllStatuses(): Promise<FetchedItem[]> {
  const results = await Promise.all(providers.map((p) => fetchProvider(p)));
  return results.filter(Boolean) as FetchedItem[];
}

const batchSummarySchema = z.object({
  summaries: z.array(z.object({ id: z.string(), summary: z.string() })),
});

async function summarizeChangesBatch(
  diffs: Array<{
    id: string;
    provider: ProviderName;
    prevStatus: NormalizedStatus | "unknown";
    newStatus: NormalizedStatus;
    description?: string;
    title?: string;
    link?: string;
  }>
) {
  if (diffs.length === 0) return [] as { id: string; summary: string }[];

  const itemsInfo = diffs
    .map(
      (d, i) => `更新${i + 1}
ID: ${d.id}
提供元: ${d.provider}
変更前: ${d.prevStatus}
変更後: ${d.newStatus}
説明: ${d.description ?? d.title ?? ""}
リンク: ${d.link ?? ""}`
    )
    .join("\n\n");

  const prompt = `以下のサービスステータス更新について、それぞれ1-2文で日本語要約を生成してください。出力は配列で、各要素は { id, summary } としてください。
\n${itemsInfo}`;

  try {
    const result = await generateObject({
      model: "google/gemini-2.5-flash-lite",
      prompt,
      schema: batchSummarySchema,
    });
    return result.object.summaries;
  } catch {
    return diffs.map((d) => ({
      id: d.id,
      summary: `${d.provider} の状態が ${d.prevStatus} から ${d.newStatus} に更新。`,
    }));
  }
}

export async function saveStatusDiffsAndNotify(): Promise<{ changed: number }> {
  const items = await fetchAllStatuses();
  const now = new Date();

  // 差分抽出
  const diffs: Array<{
    item: FetchedItem;
    prevStatus: NormalizedStatus | "unknown";
  }> = [];
  for (const item of items) {
    // 現在時刻以前のイベントのみを処理対象とする（将来のメンテナンス予定を除外）
    if (item.occurredAt > now) {
      console.log(
        `Skipping future event for ${item.provider}: ${item.title} (occurredAt: ${item.occurredAt.toISOString()})`
      );
      continue;
    }
    const latest = await db
      .select()
      .from(statusLatest)
      .where(eq(statusLatest.provider, item.provider))
      .orderBy(desc(statusLatest.updatedAt))
      .limit(1);
    const prev = latest[0];

    // 重複チェック：同じタイトルとリンクの組み合わせで、10分以内の場合は重複とみなす
    const whereConditions = [eq(statusEvents.provider, item.provider)];
    if (item.title) whereConditions.push(eq(statusEvents.title, item.title));
    if (item.link) whereConditions.push(eq(statusEvents.link, item.link));

    const recentEvent = await db
      .select()
      .from(statusEvents)
      .where(and(...whereConditions))
      .orderBy(desc(statusEvents.occurredAt))
      .limit(1);

    const isDuplicate =
      recentEvent[0] &&
      Math.abs(
        item.occurredAt.getTime() - recentEvent[0].occurredAt.getTime()
      ) <
        10 * 60 * 1000; // 10分

    if (isDuplicate) {
      console.log(
        `Skipping duplicate notification for ${item.provider}: ${item.title}`
      );
      continue;
    }

    // ステータスのみで差分を判定（descriptionの変更は無視）
    const hasDiff = !prev || prev.status !== item.status;

    if (hasDiff)
      diffs.push({
        item,
        prevStatus: (prev?.status as NormalizedStatus) ?? "unknown",
      });
  }

  if (diffs.length === 0) return { changed: 0 };

  // バッチ要約
  const summaries = await summarizeChangesBatch(
    diffs.map(({ item, prevStatus }) => ({
      id: `${item.provider}_${item.occurredAt.getTime()}`,
      provider: item.provider,
      prevStatus,
      newStatus: item.status,
      description: item.description,
      title: item.title,
      link: item.link,
    }))
  );

  // 保存＆通知
  for (const { item, prevStatus } of diffs) {
    const id = `${item.provider}_${item.occurredAt.getTime()}`;
    const summary =
      summaries.find((s) => s.id === id)?.summary ??
      `${item.provider} の状態が ${prevStatus} から ${item.status} に更新。`;

    await db.insert(statusEvents).values({
      provider: item.provider,
      status: item.status,
      title: item.title ?? null,
      description: summary,
      link: item.link ?? null,
      raw: JSON.stringify(item.raw),
      occurredAt: item.occurredAt,
    });

    const latest = await db
      .select()
      .from(statusLatest)
      .where(eq(statusLatest.provider, item.provider))
      .orderBy(desc(statusLatest.updatedAt))
      .limit(1);
    if (latest[0]) {
      await db
        .update(statusLatest)
        .set({
          status: item.status,
          description: summary,
          raw: JSON.stringify(item.raw),
        })
        .where(eq(statusLatest.provider, item.provider));
    } else {
      await db.insert(statusLatest).values({
        provider: item.provider,
        status: item.status,
        description: summary,
        raw: JSON.stringify(item.raw),
      });
    }

    const message = `【ステータス更新】${summary}\n<${item.link ?? ""}>`;
    const isDev = process.env.NODE_ENV === "development";
    try {
      await sendDiscordWebhook(isDev ? "admin" : "status", message);
    } catch (e) {
      console.error("Failed to send discord status update", e);
    }
  }

  revalidatePath("/[locale]/(main)/status");
  return { changed: diffs.length };
}

export async function getLatestStatuses() {
  return await db
    .select()
    .from(statusLatest)
    .orderBy(desc(statusLatest.updatedAt));
}

export async function getStatusEvents(params: {
  provider?: ProviderName;
  severity?: NormalizedStatus;
  from?: Date;
  page?: number;
  pageSize?: number;
}) {
  const { provider, severity, from, page = 1, pageSize = 20 } = params;
  const where = [] as any[];
  if (provider) where.push(eq(statusEvents.provider, provider));
  if (severity) where.push(eq(statusEvents.status, severity));
  if (from) where.push(gte(statusEvents.occurredAt, from));

  const events = await db
    .select()
    .from(statusEvents)
    .where(
      where.length
        ? where.length === 1
          ? where[0]
          : and(...where)
        : (undefined as any)
    )
    .orderBy(desc(statusEvents.occurredAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return events;
}

export async function runStatusCron() {
  return await saveStatusDiffsAndNotify();
}
