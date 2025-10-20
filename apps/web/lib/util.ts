import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import { enUS, ja } from "date-fns/locale";
import { Locale } from "./i18n/locale";

export const formatReadingTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  if (minutes > 0) {
    return `${minutes}分${seconds}秒`;
  } else {
    return `${seconds}秒`;
  }
};

export const formatDateByRecency = (
  dateString: string | Date | number,
  locale: Locale
) => {
  const date = new Date(dateString);
  const diffDays = differenceInDays(new Date(), date);

  if (diffDays < 5) {
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: locale === "ja" ? ja : enUS,
    });
  }

  return format(date, "yyyy年MM月dd日");
};
