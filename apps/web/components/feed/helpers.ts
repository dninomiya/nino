import type { FeedItem } from "@/lib/feed";

import type { FeedSearchParamsState } from "./search-params.shared";

type LabelDictionary = Record<string, string>;

const tagLabelMap: Record<string, keyof LabelDictionary> = {
  feature: "feature",
  event: "event",
  bugfix: "bugfix",
  "big-news": "bigNews",
  release: "release",
  update: "update",
  announcement: "announcement",
  tutorial: "tutorial",
  documentation: "documentation",
  security: "security",
  performance: "performance",
  "breaking-change": "breakingChange",
};

const feedTypeLabelMap: Record<string, keyof LabelDictionary> = {
  releases: "releases",
  blog: "blog",
  changelog: "changelog",
  youtube: "youtube",
};

export function getTagLabel(tag: string, labels: LabelDictionary): string {
  const key = tagLabelMap[tag];
  if (!key) {
    return tag;
  }

  return labels[key] ?? tag;
}

export function getFeedTypeLabel(
  type: string,
  labels: LabelDictionary
): string {
  const key = feedTypeLabelMap[type];
  if (!key) {
    return type;
  }

  return labels[key] ?? type;
}

export function filterFeedItems(
  feedItems: FeedItem[],
  filters: FeedSearchParamsState
): FeedItem[] {
  return feedItems.filter((item) => {
    if (filters.type.length > 0 && !filters.type.includes(item.type)) {
      return false;
    }

    if (filters.source.length > 0 && !filters.source.includes(item.source)) {
      return false;
    }

    if (filters.tags.length > 0) {
      if (!item.tags) {
        return false;
      }

      const hasMatchingTag = item.tags.some((tag) =>
        filters.tags.includes(tag)
      );

      if (!hasMatchingTag) {
        return false;
      }
    }

    return true;
  });
}

