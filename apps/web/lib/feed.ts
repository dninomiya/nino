import "server-only";
import Parser from "rss-parser";
import { isAfter, subDays } from "date-fns";
import { LucideIcon } from "lucide-react";
import { SiNextdotjs } from "@icons-pack/react-simple-icons";

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
  icon: LucideIcon;
  feeds: FeedConfig[];
};

const collections: Collection[] = [
  {
    name: "Next.js",
    icon: SiNextdotjs,
    feeds: [
      {
        method: "rss",
        url: "https://github.com/vercel/next.js/releases.atom",
        category: "リリース",
      },
      {
        method: "rss",
        url: "https://nextjs.org/feed.xml",
        category: "ニュース",
      },
    ],
  },
  {
    name: "React",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/facebook/react/releases.atom",
        category: "リリース",
      },
    ],
  },
  {
    name: "Resend",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/resend/resend-node/releases.atom",
        category: "リリース",
      },
    ],
  },
  {
    name: "Better Auth",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/better-auth/better-auth/releases.atom",
        category: "リリース",
      },
    ],
  },
  {
    name: "Turso",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/tursodatabase/libsql/releases.atom",
        category: "リリース",
      },
    ],
  },
  {
    name: "Raycast",
    feeds: [
      {
        method: "rss",
        url: "https://www.raycast.com/blog/rss",
        category: "ニュース",
      },
    ],
  },
  {
    name: "Notion",
    feeds: [
      {
        method: "rss",
        url: "https://www.notion.com/ja/releases/rss.xml",
        category: "ニュース",
      },
    ],
  },
  {
    name: "Drizzle",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/drizzle-team/drizzle-orm/releases.atom",
        category: "リリース",
      },
    ],
  },
  {
    name: "Stripe",
    feeds: [
      {
        method: "rss",
        url: "https://stripe.com/blog/feed.rss",
        category: "ニュース",
      },
    ],
  },
  {
    name: "nuqs",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/47ng/nuqs/releases.atom",
        category: "リリース",
      },
    ],
  },
  {
    name: "React Hook Form",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/react-hook-form/react-hook-form/releases.atom",
        category: "リリース",
      },
    ],
  },
  {
    name: "shadcn/ui",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/shadcn-ui/ui/releases.atom",
        category: "リリース",
      },
    ],
  },
  {
    name: "Tailwind CSS",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/tailwindlabs/tailwindcss/releases.atom",
        category: "リリース",
      },
      {
        method: "rss",
        url: "https://tailwindcss.com/feeds/feed.xml",
        category: "ニュース",
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
