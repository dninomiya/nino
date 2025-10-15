import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

export const formatReadingTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  if (minutes > 0) {
    return `${minutes}分${seconds}秒`;
  } else {
    return `${seconds}秒`;
  }
};

export const formatDateByRecency = (dateString: string) => {
  const date = new Date(dateString);
  // 何日まえか
  const diffDays = differenceInDays(new Date(), date);

  if (diffDays < 5) {
    return formatDistanceToNow(date, { addSuffix: true, locale: ja });
  }

  return format(date, "yyyy年MM月dd日");
};
