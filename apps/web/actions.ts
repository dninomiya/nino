"use server";

import { getFeedItems, saveFeedItemsToDB } from "@/lib/feed-server";

export async function fetchFeedItems() {
  const feedItems = await getFeedItems(7);
  await saveFeedItemsToDB(feedItems);
}
