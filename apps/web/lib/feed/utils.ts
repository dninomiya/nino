import { FeedType, FeedCollection } from "./types";
import { collections } from "./configs";

export function getAvailableTechnologies(): string[] {
  return collections.map((collection) => collection.name);
}

export function getAvailableTypes(): FeedType[] {
  const types = new Set<FeedType>();
  collections.forEach((collection) => {
    collection.feeds.forEach((feed) => {
      if (feed.method === "rss") {
        types.add(feed.type);
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
export function getCollectionByName(name: string): FeedCollection | undefined {
  return collections.find((collection) => collection.name === name);
}
