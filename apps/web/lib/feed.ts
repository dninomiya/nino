import "server-only";
import Parser from "rss-parser";
import { isAfter, subDays } from "date-fns";

type FeedConfig =
  | { method: "rss"; url: string; category: string }
  | {
      method: "scrape";
      url: string;
      category: string;
      selector: (html: string) => Array<{
        title: string;
        url: string;
        date: Date;
      }>;
    };

type Collection = {
  name: string;
  feeds: FeedConfig[];
};

const collections: Collection[] = [
  {
    name: "Next.js",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/vercel/next.js/releases.atom",
        category: "リリース",
      },
      {
        method: "rss",
        url: "https://nextjs.org/feed.xml",
        category: "ブログ",
      },
    ],
  },
];

export type FeedItem = {
  date: Date;
  title: string;
  url: string;
  category: string;
  source: string;
};

const parser = new Parser();

async function fetchRssFeed(
  url: string,
  category: string,
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
          category,
          source,
        })) || []
    );
  } catch (error) {
    console.error(`Failed to fetch RSS feed from ${url}:`, error);
    return [];
  }
}

async function fetchScrapedFeed(
  url: string,
  category: string,
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
        category,
        source,
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
          feed.category,
          collection.name,
          days
        );
        allItems.push(...items);
      } else if (feed.method === "scrape") {
        const items = await fetchScrapedFeed(
          feed.url,
          feed.category,
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
