import Parser from "rss-parser";
import { isAfter, subDays } from "date-fns";
import { LucideIcon } from "lucide-react";
import {
  SiNextdotjs,
  SiReact,
  SiResend,
  SiGithub,
  SiTurso,
  SiRaycast,
  SiNotion,
  SiDrizzle,
  SiStripe,
  SiReacthookform,
  SiTailwindcss,
  SiVercel,
} from "@icons-pack/react-simple-icons";

type FeedConfig =
  | {
      method: "rss";
      url: string;
      type: "releases" | "blog" | "changelog" | "youtube";
    }
  | {
      method: "scrape";
      url: string;
      type: string;
      selector: (html: string) => Array<{
        title: string;
        url: string;
        date: Date;
      }>;
    };

type Collection = {
  name: string;
  icon: LucideIcon;
  category: string;
  feeds: FeedConfig[];
};

const collections: Collection[] = [
  {
    name: "Next.js",
    icon: SiNextdotjs,
    category: "フレームワーク",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/vercel/next.js/releases.atom",
        type: "releases",
      },
      {
        method: "rss",
        url: "https://nextjs.org/feed.xml",
        type: "blog",
      },
    ],
  },
  {
    name: "Vercel",
    icon: SiVercel,
    category: "SaaS/BaaS",
    feeds: [
      {
        method: "rss",
        url: "https://vercel.com/atom",
        type: "blog",
      },
      {
        method: "rss",
        url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCLq8gNoee7oXM7MvTdjyQvA",
        type: "changelog",
      },
    ],
  },
  {
    name: "React",
    icon: SiReact,
    category: "フレームワーク",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/facebook/react/releases.atom",
        type: "releases",
      },
      {
        method: "rss",
        url: "https://react.dev/rss.xml",
        type: "blog",
      },
      {
        method: "rss",
        url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC1hOCRBN2mnXgN5reSoO3pQ",
        type: "youtube",
      },
    ],
  },
  {
    name: "Resend",
    icon: SiResend,
    category: "SaaS/BaaS",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/resend/resend-node/releases.atom",
        type: "releases",
      },
      {
        method: "rss",
        url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC0FkhoSz2kYqHVBk4L0QYIg",
        type: "youtube",
      },
    ],
  },
  {
    name: "Better Auth",
    icon: SiGithub,
    category: "ライブラリ",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/better-auth/better-auth/releases.atom",
        type: "releases",
      },
    ],
  },
  {
    name: "Turso",
    icon: SiTurso,
    category: "SaaS/BaaS",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/tursodatabase/libsql/releases.atom",
        type: "releases",
      },
      {
        method: "rss",
        url: "https://turso.tech/blog/feed.xml",
        type: "blog",
      },
    ],
  },
  {
    name: "Raycast",
    icon: SiRaycast,
    category: "ツール",
    feeds: [
      {
        method: "rss",
        url: "https://www.raycast.com/rss/feed.xml",
        type: "blog",
      },
      {
        method: "rss",
        url: "https://www.raycast.com/changelog/feed.xml",
        type: "changelog",
      },
      {
        method: "rss",
        url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCPvOHaaP9E6FqSqG1NMV_Hw",
        type: "youtube",
      },
    ],
  },
  {
    name: "Notion",
    icon: SiNotion,
    category: "ツール",
    feeds: [
      {
        method: "rss",
        url: "https://www.notion.com/ja/releases/rss.xml",
        type: "releases",
      },
    ],
  },
  {
    name: "Drizzle",
    icon: SiDrizzle,
    category: "ライブラリ",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/drizzle-team/drizzle-orm/releases.atom",
        type: "releases",
      },
    ],
  },
  {
    name: "Stripe",
    icon: SiStripe,
    category: "SaaS/BaaS",
    feeds: [
      {
        method: "rss",
        url: "https://stripe.com/blog/feed.rss",
        type: "blog",
      },
    ],
  },
  {
    name: "nuqs",
    icon: SiGithub,
    category: "ライブラリ",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/47ng/nuqs/releases.atom",
        type: "releases",
      },
      {
        method: "rss",
        url: "https://nuqs.dev/blog/rss.xml",
        type: "blog",
      },
    ],
  },
  {
    name: "React Hook Form",
    icon: SiReacthookform,
    category: "ライブラリ",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/react-hook-form/react-hook-form/releases.atom",
        type: "releases",
      },
    ],
  },
  {
    name: "shadcn/ui",
    icon: SiGithub,
    category: "ライブラリ",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/shadcn-ui/ui/releases.atom",
        type: "releases",
      },
    ],
  },
  {
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    category: "ライブラリ",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/tailwindlabs/tailwindcss/releases.atom",
        type: "releases",
      },
      {
        method: "rss",
        url: "https://tailwindcss.com/feeds/feed.xml",
        type: "blog",
      },
      {
        method: "rss",
        url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCOe-8z68tgw9ioqVvYM4ddQ",
        type: "youtube",
      },
    ],
  },
];

export type FeedItem = {
  date: Date;
  title: string;
  url: string;
  type: string;
  source: string;
  content?: string;
  thumbnail?: string;
  rawXml?: string;
  rssUrl?: string;
  summary?: string;
};

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

async function fetchRssFeed(
  url: string,
  type: string,
  source: string,
  days: number
): Promise<FeedItem[]> {
  try {
    const feed = await parser.parseURL(url);
    const cutoffDate = subDays(new Date(), days);

    return (
      feed.items
        ?.filter((item) => {
          if (!item.isoDate && !item.pubDate) return false;
          const itemDate = new Date(item.isoDate || item.pubDate || "");
          return isAfter(itemDate, cutoffDate);
        })
        .map((item) => ({
          date: new Date(item.isoDate || item.pubDate || ""),
          title: item.title || "No title",
          url: item.link || "",
          type,
          source,
          content: "", // HTMLコンテントは格納しない
          thumbnail: extractThumbnail(item),
          rawXml: JSON.stringify(item, null, 2), // アイテムの詳細データをJSON形式で保存
          rssUrl: url, // RSSフィードのURL
        })) || []
    );
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

    return items
      .filter((item) => isAfter(item.date, cutoffDate))
      .map((item) => ({
        date: item.date,
        title: item.title,
        url: item.url,
        type,
        source,
        content: "", // スクレイピングではcontentは空文字列
        thumbnail: undefined, // スクレイピングではサムネイルは未対応
        rawXml: JSON.stringify(item, null, 2), // スクレイピングアイテムの詳細データ
        rssUrl: url, // スクレイピング元のURL
      }));
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

export function getAvailableTechnologies(): string[] {
  return collections.map((collection) => collection.name);
}

export const typeLabels: Record<string, string> = {
  リリース: "リリース",
  ニュース: "ニュース",
  変更履歴: "変更履歴",
  動画: "動画",
  releases: "リリース",
  blog: "ニュース",
  changelog: "変更履歴",
  youtube: "動画",
};

// カテゴリの表示順序
export const categoryOrder = [
  "フレームワーク",
  "ライブラリ",
  "ツール",
  "SaaS/BaaS",
];

export function getAvailableTypes(): string[] {
  const types = new Set<string>();
  collections.forEach((collection) => {
    collection.feeds.forEach((feed) => {
      if (feed.method === "rss") {
        // 英語のタイプを日本語にマッピング
        const japaneseType = typeLabels[feed.type];
        if (japaneseType) {
          types.add(japaneseType);
        }
      }
    });
  });

  return Array.from(types);
}

// カテゴリごとに技術をグループ化する関数
export function getTechnologiesByCategory(): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};

  collections.forEach((collection) => {
    const category = collection.category;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(collection.name);
  });

  return grouped;
}

// 技術名からコレクション情報を取得する関数
export function getCollectionByName(name: string): Collection | undefined {
  return collections.find((collection) => collection.name === name);
}
