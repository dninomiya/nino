"use client";

import { formatDateByRecency } from "@/lib/util";

export const RecencyDate = ({ date }: { date: Date | number }) => {
  return <span>{formatDateByRecency(date)}</span>;
};
