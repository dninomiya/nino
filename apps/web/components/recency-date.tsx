"use client";

import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import { enUS, ja } from "date-fns/locale";
import { Locale } from "@/lib/i18n/locale";
import { useEffect, useState } from "react";

interface RecencyDateProps {
  date: string | Date | number;
  locale: Locale;
}

export const RecencyDate = ({ date, locale }: RecencyDateProps) => {
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    const dateObj = new Date(date);
    const diffDays = differenceInDays(new Date(), dateObj);

    if (diffDays < 5) {
      setFormattedDate(
        formatDistanceToNow(dateObj, {
          addSuffix: true,
          locale: locale === "ja" ? ja : enUS,
        })
      );
    } else {
      setFormattedDate(format(dateObj, "yyyy年MM月dd日"));
    }
  }, [date, locale]);

  return <span>{formattedDate || <>&nbsp;</>}</span>;
};
