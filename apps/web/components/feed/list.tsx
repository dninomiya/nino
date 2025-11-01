import { filterFeedItems } from "@/components/feed/helpers";
import { FeedListItem } from "@/components/feed/list-item";
import {
  parseFeedSearchParams,
  type FeedSearchParams,
  type FeedSearchParamsInput,
} from "@/components/feed/search-params";
import type { FeedItem } from "@/lib/feed";
import { getCurrentLocale, getMessage } from "@/lib/i18n/server";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty";
import { SearchX } from "lucide-react";

type FeedListProps = {
  feedItems: FeedItem[];
  searchParams?: FeedSearchParamsInput;
};

export async function FeedList({ feedItems, searchParams }: FeedListProps) {
  const filters: FeedSearchParams = await parseFeedSearchParams(searchParams);
  const filteredFeedItems = filterFeedItems(feedItems, filters);

  if (filteredFeedItems.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX />
          </EmptyMedia>
          <EmptyTitle>該当する結果が見つかりません</EmptyTitle>
          <EmptyDescription>
            現在のフィルター条件に一致するフィードアイテムがありません。フィルターを調整して再度お試しください。
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const [tagMessages, feedTypeMessages] = await Promise.all([
    getMessage("Tags"),
    getMessage("FeedTypes"),
  ]);

  const locale = getCurrentLocale();

  return (
    <div className="space-y-4">
      {filteredFeedItems.map((item, index) => (
        <FeedListItem
          key={`${item.url}-${index}`}
          item={item}
          locale={locale}
          tagMessages={tagMessages}
          feedTypeMessages={feedTypeMessages}
          index={index}
        />
      ))}
    </div>
  );
}
