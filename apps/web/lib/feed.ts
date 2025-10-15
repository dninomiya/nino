import "server-only";
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
  | { method: "rss"; url: string; category: "releases" | "blog" | "changelog" }
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
        category: "releases",
      },
      {
        method: "rss",
        url: "https://nextjs.org/feed.xml",
        category: "blog",
      },
    ],
  },
  // add vercel
  {
    name: "Vercel",
    icon: SiVercel,
    feeds: [
      {
        method: "rss",
        url: "https://vercel.com/atom",
        category: "blog",
      },
    ],
  },
  {
    name: "React",
    icon: SiReact,
    feeds: [
      {
        method: "rss",
        url: "https://github.com/facebook/react/releases.atom",
        category: "releases",
      },
      {
        method: "rss",
        url: "https://react.dev/rss.xml",
        category: "blog",
      },
    ],
  },
  {
    name: "Resend",
    icon: SiResend,
    feeds: [
      {
        method: "rss",
        url: "https://github.com/resend/resend-node/releases.atom",
        category: "releases",
      },
    ],
  },
  {
    name: "Better Auth",
    icon: SiGithub,
    feeds: [
      {
        method: "rss",
        url: "https://github.com/better-auth/better-auth/releases.atom",
        category: "releases",
      },
    ],
  },
  {
    name: "Turso",
    icon: SiTurso,
    feeds: [
      {
        method: "rss",
        url: "https://github.com/tursodatabase/libsql/releases.atom",
        category: "releases",
      },
      {
        method: "rss",
        url: "https://turso.tech/blog/feed.xml",
        category: "blog",
      },
    ],
  },
  {
    name: "Raycast",
    icon: SiRaycast,
    feeds: [
      {
        method: "rss",
        url: "https://www.raycast.com/blog/rss",
        category: "blog",
      },
      {
        method: "rss",
        url: "https://www.raycast.com/changelog/rss",
        category: "changelog",
      },
    ],
  },
  {
    name: "Notion",
    icon: SiNotion,
    feeds: [
      {
        method: "rss",
        url: "https://www.notion.com/ja/releases/rss.xml",
        category: "releases",
      },
    ],
  },
  {
    name: "Drizzle",
    icon: SiDrizzle,
    feeds: [
      {
        method: "rss",
        url: "https://github.com/drizzle-team/drizzle-orm/releases.atom",
        category: "releases",
      },
    ],
  },
  {
    name: "Stripe",
    icon: SiStripe,
    feeds: [
      {
        method: "rss",
        url: "https://stripe.com/blog/feed.rss",
        category: "blog",
      },
    ],
  },
  {
    name: "nuqs",
    icon: SiGithub,
    feeds: [
      {
        method: "rss",
        url: "https://github.com/47ng/nuqs/releases.atom",
        category: "releases",
      },
      {
        method: "rss",
        url: "https://nuqs.dev/blog/rss.xml",
        category: "blog",
      },
    ],
  },
  {
    name: "React Hook Form",
    icon: SiReacthookform,
    feeds: [
      {
        method: "rss",
        url: "https://github.com/react-hook-form/react-hook-form/releases.atom",
        category: "releases",
      },
    ],
  },
  {
    name: "shadcn/ui",
    icon: SiGithub,
    feeds: [
      {
        method: "rss",
        url: "https://github.com/shadcn-ui/ui/releases.atom",
        category: "releases",
      },
    ],
  },
  {
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    feeds: [
      {
        method: "rss",
        url: "https://github.com/tailwindlabs/tailwindcss/releases.atom",
        category: "releases",
      },
      {
        method: "rss",
        url: "https://tailwindcss.com/feeds/feed.xml",
        category: "blog",
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
