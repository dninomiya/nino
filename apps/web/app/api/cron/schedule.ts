import { fetchAndSaveNewFeedItems } from "@/lib/feed-server";
import { type Schedule } from "./helper";
import { runStatusCron } from "@/lib/status-server";

export const SCHEDULES: Schedule[] = [
  {
    when: { type: "interval", everyMinutes: 10, day: "everyday" },
    action: async () => {
      await runStatusCron();
    },
  },
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
  {
    when: { time: "00:00", day: "everyday" },
    action: async () => {
      await fetchAndSaveNewFeedItems();
    },
  },
];
