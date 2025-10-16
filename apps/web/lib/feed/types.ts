import { LucideIcon } from "lucide-react";

// Feedタイプの定義
export type FeedType = "releases" | "blog" | "changelog" | "youtube";

export type FeedConfig =
  | {
      method: "rss";
      url: string;
      type: FeedType;
    }
  | {
      method: "scrape";
      url: string;
      type: FeedType;
      selector: (html: string) => Array<{
        title: string;
        url: string;
        date: Date;
      }>;
    };

export type FeedCollection = {
  name: string;
  icon: LucideIcon;
  category: string;
  feeds: FeedConfig[];
};

export type FeedItem = {
  date: Date;
  title: string;
  url: string;
  type: FeedType;
  source: string;
  content?: string;
  thumbnail?: string;
  rawXml?: string;
  rssUrl?: string;
  summary?: string;
  tags?: string[];
};
