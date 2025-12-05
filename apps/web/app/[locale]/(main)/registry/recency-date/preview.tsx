"use client";

import { RecencyDate } from "@/registry/components/recency-date";
import {
  setMilliseconds,
  setSeconds,
  subDays,
  subHours,
  subMinutes,
  subWeeks,
} from "date-fns";

export default function Preview() {
  const now = new Date();
  const days = [
    subMinutes(now, 1),
    subMinutes(now, 10),
    subHours(now, 5),
    subDays(now, 2),
    subWeeks(now, 1),
  ].map((day) => setSeconds(setMilliseconds(day, 0), 0));

  return (
    <div className="space-y-4 flex flex-col gap-2 *:w-fit">
      {days.map((day) => (
        <RecencyDate key={day.toISOString()} date={day} />
      ))}
    </div>
  );
}
