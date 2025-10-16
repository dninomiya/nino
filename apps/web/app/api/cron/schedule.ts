import { fetchAndSaveNewFeedItems } from "@/lib/feed-server";
import { type Schedule } from "./helper";

export const SCHEDULES: Schedule[] = [
  {
    when: { time: "06:00", day: "everyday" },
    action: async () => {
      await fetchAndSaveNewFeedItems();
    },
  },
  {
    when: { time: "10:00", day: "everyday" },
    action: async () => {
      await fetchAndSaveNewFeedItems();
    },
  },
  {
    when: { time: "14:00", day: "everyday" },
    action: async () => {
      await fetchAndSaveNewFeedItems();
    },
  },
  {
    when: { time: "18:00", day: "everyday" },
    action: async () => {
      await fetchAndSaveNewFeedItems();
    },
  },
];
