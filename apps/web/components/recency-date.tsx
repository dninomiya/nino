"use client";

import { formatDateByRecency } from "@/lib/util";
import { useEffect, useState } from "react";

export const RecencyDate = ({ date }: { date: Date | number }) => {
  const [client, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  if (!client) {
    return null;
  }

  return <span>{formatDateByRecency(date)}</span>;
};
