"use client";

import { formatDateByRecency } from "@/lib/util";
import { useEffect, useState } from "react";
import { useI18n } from "./i18n-provider";

export const RecencyDate = ({ date }: { date: Date | number }) => {
  const [client, setClient] = useState(false);
  const { locale } = useI18n();

  useEffect(() => {
    setClient(true);
  }, []);

  if (!client) {
    return <span>&nbsp;</span>;
  }

  return <span>{formatDateByRecency(date, locale)}</span>;
};
