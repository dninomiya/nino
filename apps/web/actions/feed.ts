"use server";

import { fetchAndSaveNewFeedItems } from "@/lib/feed-server";

export async function fetchFeedItems() {
  await fetchAndSaveNewFeedItems(7);
}
