import "server-only";

import Parser from "rss-parser";
import { isAfter, subDays } from "date-fns";
import { collections, type FeedItem } from "./feed";
import { generateObject } from "ai";
import { z } from "zod";

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

// AIによるタイトル、要約、タグ自動生成関数
async function generateContentForItem(item: any): Promise<{
  title: string;
  summary: string;
  tags: string[];
}> {
  try {
    const content =
      item.content || item.contentSnippet || item.description || "";
    const originalTitle = item.title || "";

    // タイトルとコンテンツからタイトル、要約、タグを生成
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

    const contentPreview = content.substring(0, 1000);
    const prompt =
      "以下の技術記事のタイトルと内容を分析して、以下の3つを生成してください：\n\n" +
      "1. より分かりやすい日本語のタイトル（元のタイトルを改善）\n" +
      "2. 記事の要約（2-3文で簡潔に日本語で）\n" +
      "3. 適切なタグ（1-3個選択）\n\n" +
      "元のタイトル: " +
      originalTitle +
      "\n" +
      "内容: " +
      contentPreview +
      "...\n\n" +
      "利用可能なタグ:\n" +
      availableTags +
      "\n\n" +
      "注意事項：\n" +
      "- タイトルは日本語で、技術的な内容を分かりやすく表現してください\n" +
      "- 要約は日本語で、記事の要点を簡潔にまとめてください\n" +
      "- タグは記事の内容に最も適したものを選択してください";

    const result = await generateObject({
      model: "google/gemini-2.5-flash-lite",
      prompt,
      schema: summarySchema,
    });

    return {
      title: result.object.title || originalTitle,
      summary: result.object.summary || "",
      tags: result.object.tags || [],
    };
  } catch (error) {
    console.error("Failed to generate content:", error);
    return {
      title: item.title || "",
      summary: "",
      tags: [],
    };
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

    const itemsWithGeneratedContent = await Promise.all(
      filteredItems.map(async (item) => {
        const generatedContent = await generateContentForItem(item);
        return {
          date: new Date(item.isoDate || item.pubDate || ""),
          title: generatedContent.title,
          url: item.link || "",
          type,
          source,
          content: "", // HTMLコンテントは格納しない
          thumbnail: extractThumbnail(item),
          rawXml: JSON.stringify(item, null, 2), // アイテムの詳細データをJSON形式で保存
          rssUrl: url, // RSSフィードのURL
          summary: generatedContent.summary,
          tags: generatedContent.tags,
        };
      })
    );

    return itemsWithGeneratedContent;
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

    const itemsWithGeneratedContent = await Promise.all(
      filteredItems.map(async (item) => {
        const generatedContent = await generateContentForItem(item);
        return {
          date: item.date,
          title: generatedContent.title,
          url: item.url,
          type,
          source,
          content: "", // スクレイピングではcontentは空文字列
          thumbnail: undefined, // スクレイピングではサムネイルは未対応
          rawXml: JSON.stringify(item, null, 2), // スクレイピングアイテムの詳細データ
          rssUrl: url, // スクレイピング元のURL
          summary: generatedContent.summary,
          tags: generatedContent.tags,
        };
      })
    );

    return itemsWithGeneratedContent;
  } catch (error) {
    console.error(`Failed to scrape feed from ${url}:`, error);
    return [];
  }
}

export async function getFeedItems(days: number = 7): Promise<FeedItem[]> {
  const allItems: FeedItem[] = [];

  for (const collection of collections) {
    for (const feed of collection.feeds) {
      if (feed.method === "rss") {
        const items = await fetchRssFeed(
          feed.url,
          feed.type,
          collection.name,
          days
        );
        allItems.push(...items);
      } else if (feed.method === "scrape") {
        const items = await fetchScrapedFeed(
          feed.url,
          feed.type,
          collection.name,
          feed.selector,
          days
        );
        allItems.push(...items);
      }
    }
  }

  // 日付順（新しい順）でソート
  return allItems.sort((a, b) => b.date.getTime() - a.date.getTime());
}
