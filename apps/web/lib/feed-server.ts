import "server-only";

import { db } from "@workspace/db";
import { feedItems } from "@workspace/db/schemas/feed";
import { generateObject } from "ai";
import { isAfter, subDays } from "date-fns";
import { desc, gte, eq, and, or, isNull, ne } from "drizzle-orm";
import Parser from "rss-parser";
import { z } from "zod";
import { collections, type FeedItem } from "./feed";

// タグの定義
export const TAGS = {
  FEATURE: "feature",
  EVENT: "event",
  BUGFIX: "bugfix",
  BIG_NEWS: "big-news",
  RELEASE: "release",
  UPDATE: "update",
  ANNOUNCEMENT: "announcement",
  TUTORIAL: "tutorial",
  DOCUMENTATION: "documentation",
  SECURITY: "security",
  PERFORMANCE: "performance",
  BREAKING_CHANGE: "breaking-change",
} as const;

// タグの日本語ラベルマップ
export const TAG_LABELS: Record<string, string> = {
  [TAGS.FEATURE]: "機能追加",
  [TAGS.EVENT]: "イベント",
  [TAGS.BUGFIX]: "バグ修正",
  [TAGS.BIG_NEWS]: "ビッグニュース",
  [TAGS.RELEASE]: "リリース",
  [TAGS.UPDATE]: "アップデート",
  [TAGS.ANNOUNCEMENT]: "お知らせ",
  [TAGS.TUTORIAL]: "チュートリアル",
  [TAGS.DOCUMENTATION]: "ドキュメント",
  [TAGS.SECURITY]: "セキュリティ",
  [TAGS.PERFORMANCE]: "パフォーマンス",
  [TAGS.BREAKING_CHANGE]: "破壊的変更",
};

const summarySchema = z.object({
  title: z.string(),
  summary: z.string(),
  tags: z.array(z.string()).optional(),
});

// バッチ処理用のスキーマ
const batchSummarySchema = z.object({
  summaries: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      summary: z.string(),
      tags: z.array(z.string()).optional(),
    })
  ),
});

const parser = new Parser({
  customFields: {
    item: [
      ["enclosure", "enclosure", { keepArray: true }],
      ["media:thumbnail", "mediaThumbnail"],
    ],
  },
});

// サムネイル画像を抽出する関数
function extractThumbnail(item: any): string | undefined {
  // 1. media:thumbnailから取得
  if (item.mediaThumbnail?.$?.url) {
    return item.mediaThumbnail.$.url;
  }

  // 2. enclosureから画像を取得（複数の構造に対応）
  if (item.enclosure) {
    // 配列の場合
    if (Array.isArray(item.enclosure)) {
      const imageEnclosure = item.enclosure.find((enc: any) => {
        const type = enc.$?.type || enc.type;
        return type && type.startsWith("image/");
      });
      if (imageEnclosure) {
        return imageEnclosure.$?.url || imageEnclosure.url;
      }
    }
    // 単一オブジェクトの場合
    else if (item.enclosure.$?.type?.startsWith("image/")) {
      return item.enclosure.$.url;
    } else if (item.enclosure.type?.startsWith("image/")) {
      return item.enclosure.url;
    }
  }

  // 3. description内の画像から抽出
  const description = (item as any).description;
  if (description) {
    const match = description.match(/<img[^>]+src="([^">]+)"/i);
    if (match && match[1]) {
      return match[1];
    }
  }

  // 4. content内の画像から抽出
  if (item.content) {
    const match = item.content.match(/<img[^>]+src="([^">]+)"/i);
    if (match && match[1]) {
      return match[1];
    }
  }

  // 5. contentSnippet内の画像から抽出
  if (item.contentSnippet) {
    const match = item.contentSnippet.match(/<img[^>]+src="([^">]+)"/i);
    if (match && match[1]) {
      return match[1];
    }
  }

  // 6. YouTubeの場合は動画IDからサムネイルを生成
  if (item.link && item.link.includes("youtube.com/watch")) {
    const videoIdMatch = item.link.match(/[?&]v=([^&]+)/);
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`;
    }
  }

  return undefined;
}

// バッチ要約生成の共通関数
export async function generateBatchSummaries(
  items: Array<{
    id: string;
    title: string;
    content: string;
  }>
): Promise<
  Array<{
    id: string;
    title: string;
    summary: string;
    tags: string[];
  }>
> {
  if (items.length === 0) {
    return [];
  }

  try {
    const availableTags = [
      "feature: 新機能の追加や機能拡張",
      "event: イベント、カンファレンス、ワークショップ",
      "bugfix: バグ修正、不具合対応",
      "big-news: 大きなニュース、重要な発表",
      "release: 新バージョンリリース",
      "update: アップデート、改善",
      "announcement: お知らせ、告知",
      "tutorial: チュートリアル、ガイド",
      "documentation: ドキュメント更新",
      "security: セキュリティ関連",
      "performance: パフォーマンス改善",
      "breaking-change: 破壊的変更",
    ].join("\n");

    // アイテムの情報を構造化
    const itemsInfo = items
      .map(
        (item, index) =>
          `記事${index + 1}:
ID: ${item.id}
タイトル: ${item.title}
内容: ${item.content}`
      )
      .join("\n\n");

    const prompt = `以下の技術記事を分析して、それぞれの記事について以下の3つを生成してください：

1. より分かりやすい日本語のタイトル（元のタイトルを改善）
2. 記事の要約（2-3文で簡潔に日本語で）
3. 適切なタグ（1-3個選択）

${itemsInfo}

利用可能なタグ:
${availableTags}

注意事項：
- 各記事について、IDに対応する結果を返してください
- タイトルは日本語で、技術的な内容を分かりやすく表現してください
- 要約は日本語で、記事の要点を簡潔にまとめてください
- タグは記事の内容に最も適したものを選択してください
- 結果は配列形式で、各要素にid、title、summary、tagsを含めてください`;

    const result = await generateObject({
      model: "google/gemini-2.5-flash-lite",
      prompt,
      schema: batchSummarySchema,
    });

    return result.object.summaries.map((summary) => ({
      id: summary.id,
      title: summary.title,
      summary: summary.summary,
      tags: summary.tags || [],
    }));
  } catch (error) {
    console.error("Failed to generate batch summaries:", error);
    // エラーの場合は元のタイトルと空の要約を返す
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      summary: "",
      tags: [],
    }));
  }
}

async function fetchRssFeed(
  url: string,
  type: string,
  source: string,
  days: number
): Promise<FeedItem[]> {
  try {
    const feed = await parser.parseURL(url);
    const cutoffDate = subDays(new Date(), days);

    const filteredItems =
      feed.items?.filter((item) => {
        if (!item.isoDate && !item.pubDate) return false;
        const itemDate = new Date(item.isoDate || item.pubDate || "");
        return isAfter(itemDate, cutoffDate);
      }) || [];

    return filteredItems.map((item) => ({
      date: new Date(item.isoDate || item.pubDate || ""),
      title: item.title || "",
      url: item.link || "",
      type,
      source,
      thumbnail: extractThumbnail(item),
      rawXml: JSON.stringify(item, null, 2), // アイテムの詳細データをJSON形式で保存
      rssUrl: url, // RSSフィードのURL
      summary: "", // summary生成は別途実行
      tags: [], // summary生成は別途実行
    }));
  } catch (error) {
    console.error(`Failed to fetch RSS feed from ${url}:`, error);
    return [];
  }
}

async function fetchScrapedFeed(
  url: string,
  type: string,
  source: string,
  selector: (html: string) => Array<{ title: string; url: string; date: Date }>,
  days: number
): Promise<FeedItem[]> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const items = selector(html);
    const cutoffDate = subDays(new Date(), days);

    const filteredItems = items.filter((item) =>
      isAfter(item.date, cutoffDate)
    );

    return filteredItems.map((item) => ({
      date: item.date,
      title: item.title,
      url: item.url,
      type,
      source,
      thumbnail: undefined, // スクレイピングではサムネイルは未対応
      rawXml: JSON.stringify(item, null, 2), // スクレイピングアイテムの詳細データ
      rssUrl: url, // スクレイピング元のURL
      summary: "", // summary生成は別途実行
      tags: [], // summary生成は別途実行
    }));
  } catch (error) {
    console.error(`Failed to scrape feed from ${url}:`, error);
    return [];
  }
}

export async function getFeedItems(days: number = 7): Promise<FeedItem[]> {
  // 全てのフィード取得タスクを並列で実行
  const feedPromises = collections.flatMap((collection) =>
    collection.feeds.map((feed) => {
      if (feed.method === "rss") {
        return fetchRssFeed(feed.url, feed.type, collection.name, days);
      } else if (feed.method === "scrape") {
        return fetchScrapedFeed(
          feed.url,
          feed.type,
          collection.name,
          feed.selector,
          days
        );
      }
      return Promise.resolve([]);
    })
  );

  // 全てのフィードを並列で取得
  const feedResults = await Promise.all(feedPromises);

  // 結果を平坦化
  const allItems = feedResults.flat();

  // 日付順（新しい順）でソート
  return allItems.sort((a, b) => b.date.getTime() - a.date.getTime());
}

// 新しい共通関数: RSS取得からDB保存までを最適化
export async function fetchAndSaveNewFeedItems(
  days: number = 7
): Promise<void> {
  try {
    // 1. DBから最新アイテムの日時を取得（1クエリのみ）
    const latestItem = await db
      .select({ date: feedItems.date })
      .from(feedItems)
      .orderBy(desc(feedItems.date))
      .limit(1);

    const cutoffDate = latestItem[0]?.date || subDays(new Date(), days);

    // 2. RSSフィードを取得（summary生成なし）
    const allItems = await getFeedItems(days);

    // 3. 最新日時より新しいアイテムのみフィルタ
    const newItems = allItems.filter((item) => item.date > cutoffDate);

    if (newItems.length === 0) {
      console.log("No new feed items found");
      return;
    }

    // 4. 新規アイテムのみバッチでsummary生成（YouTube以外）
    const nonYoutubeItems = newItems.filter((item) => item.type !== "youtube");

    if (nonYoutubeItems.length > 0) {
      const batchItems = nonYoutubeItems.map((item) => {
        let content = "";
        try {
          const rawData = JSON.parse(item.rawXml || "{}");
          content =
            rawData.contentSnippet ||
            rawData.content ||
            rawData.description ||
            "";
        } catch {
          content = "";
        }

        return {
          id: `${item.url}_${item.date.getTime()}`,
          title: item.title,
          content,
        };
      });

      const summaries = await generateBatchSummaries(batchItems);

      // summaryをアイテムにマッピング
      for (const item of nonYoutubeItems) {
        const itemId = `${item.url}_${item.date.getTime()}`;
        const summary = summaries.find((s) => s.id === itemId);

        if (summary) {
          item.title = summary.title;
          item.summary = summary.summary;
          item.tags = summary.tags;
        }
      }
    }

    // 5. DB保存
    await saveFeedItemsToDB(newItems);

    console.log(
      `Processed ${newItems.length} new feed items (${nonYoutubeItems.length} with summaries)`
    );
  } catch (error) {
    console.error("Failed to fetch and save new feed items:", error);
    throw error;
  }
}

// DB に feed データを保存する関数（既存データの要約が空の場合は更新）
export async function saveFeedItemsToDB(items: FeedItem[]): Promise<void> {
  try {
    for (const item of items) {
      // 既存データがあるかチェック
      const existingItem = await db
        .select()
        .from(feedItems)
        .where(and(eq(feedItems.url, item.url), eq(feedItems.date, item.date)))
        .limit(1);

      if (existingItem.length > 0) {
        const existing = existingItem[0];

        // 既存データの要約が空で、新しいデータに要約がある場合は更新
        const hasEmptySummary =
          !existing?.summary || existing.summary.trim() === "";
        const hasNewSummary = item.summary && item.summary.trim() !== "";

        if (hasEmptySummary && hasNewSummary) {
          await db
            .update(feedItems)
            .set({
              title: item.title,
              summary: item.summary,
              tags: item.tags ? JSON.stringify(item.tags) : null,
              content: item.content || null,
              thumbnail: item.thumbnail || null,
              rawXml: item.rawXml || null,
              rssUrl: item.rssUrl || null,
            })
            .where(
              and(eq(feedItems.url, item.url), eq(feedItems.date, item.date))
            );
        }
        // 既存データに要約がある場合はスキップ
        continue;
      }

      // 新規データのみinsert
      await db.insert(feedItems).values({
        url: item.url,
        date: item.date,
        title: item.title,
        type: item.type,
        source: item.source,
        content: item.content || null,
        thumbnail: item.thumbnail || null,
        rawXml: item.rawXml || null,
        rssUrl: item.rssUrl || null,
        summary: item.summary || null,
        tags: item.tags ? JSON.stringify(item.tags) : null,
      });
    }
  } catch (error) {
    console.error("Failed to save feed items to DB:", error);
    throw error;
  }
}

// DB から feed データを取得する関数
export async function getFeedItemsFromDB(
  days: number = 7
): Promise<FeedItem[]> {
  try {
    const cutoffDate = subDays(new Date(), days);

    const items = await db
      .select()
      .from(feedItems)
      .where(gte(feedItems.date, cutoffDate))
      .orderBy(desc(feedItems.date));

    return items.map((item: any) => ({
      date: item.date,
      title: item.title,
      url: item.url,
      type: item.type,
      source: item.source,
      content: item.content || undefined,
      thumbnail: item.thumbnail || undefined,
      rawXml: item.rawXml || undefined,
      rssUrl: item.rssUrl || undefined,
      summary: item.summary || undefined,
      tags: item.tags ? JSON.parse(item.tags) : undefined,
    }));
  } catch (error) {
    console.error("Failed to get feed items from DB:", error);
    throw error;
  }
}

// summaryが空のアイテムを取得（YouTube除外）
export async function getItemsWithMissingSummary(): Promise<FeedItem[]> {
  try {
    const items = await db
      .select()
      .from(feedItems)
      .where(
        and(
          // summaryが空またはnull
          or(eq(feedItems.summary, ""), isNull(feedItems.summary)),
          // YouTube以外
          ne(feedItems.type, "youtube")
        )
      )
      .orderBy(desc(feedItems.date));

    return items.map((item: any) => ({
      date: item.date,
      title: item.title,
      url: item.url,
      type: item.type,
      source: item.source,
      content: item.content || undefined,
      thumbnail: item.thumbnail || undefined,
      rawXml: item.rawXml || undefined,
      rssUrl: item.rssUrl || undefined,
      summary: item.summary || undefined,
      tags: item.tags ? JSON.parse(item.tags) : undefined,
    }));
  } catch (error) {
    console.error("Failed to get items with missing summary:", error);
    throw error;
  }
}

// 欠損した要約をバッチで再生成
export async function regenerateMissingSummariesInBatch(): Promise<{
  successCount: number;
  totalCount: number;
  errors: string[];
}> {
  try {
    // summaryが空のアイテムを取得（YouTube除外）
    const itemsWithMissingSummary = await getItemsWithMissingSummary();

    if (itemsWithMissingSummary.length === 0) {
      return {
        successCount: 0,
        totalCount: 0,
        errors: [],
      };
    }

    // バッチサイズを設定（AIの制限を考慮）
    const batchSize = 10;
    let successCount = 0;
    const errors: string[] = [];

    // バッチごとに処理
    for (let i = 0; i < itemsWithMissingSummary.length; i += batchSize) {
      const batch = itemsWithMissingSummary.slice(i, i + batchSize);

      try {
        // バッチ用のデータを準備
        const batchItems = batch.map((item, index) => {
          let content = "";
          try {
            const rawData = JSON.parse(item.rawXml || "{}");
            content =
              rawData.contentSnippet ||
              rawData.content ||
              rawData.description ||
              "";
          } catch {
            content = "";
          }

          return {
            id: `${item.url}_${item.date.getTime()}`,
            title: item.title,
            content,
          };
        });

        // バッチ要約生成
        const summaries = await generateBatchSummaries(batchItems);

        // DBを更新
        for (const summary of summaries) {
          const [url, timestamp] = summary.id.split("_");
          if (!url || !timestamp) {
            console.error(`Invalid summary id: ${summary.id}`);
            continue;
          }
          const date = new Date(parseInt(timestamp));

          await db
            .update(feedItems)
            .set({
              title: summary.title,
              summary: summary.summary,
              tags: summary.tags ? JSON.stringify(summary.tags) : null,
            })
            .where(and(eq(feedItems.url, url), eq(feedItems.date, date)));

          successCount++;
        }
      } catch (error) {
        console.error(`Failed to process batch ${i}-${i + batchSize}:`, error);
        const batchErrors = batch.map(
          (item) =>
            `${item.title}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
        errors.push(...batchErrors);
      }
    }

    return {
      successCount,
      totalCount: itemsWithMissingSummary.length,
      errors,
    };
  } catch (error) {
    console.error("Failed to regenerate missing summaries in batch:", error);
    throw error;
  }
}
