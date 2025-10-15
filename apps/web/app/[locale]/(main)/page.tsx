import { FeedFilter } from "@/components/feed-filter";
import { FeedList } from "@/components/feed-list";
import { FetchFeedButton } from "@/components/fetch-feed-button";
import { RecencyDate } from "@/components/recency-date";
import { getFeedItemsFromDB } from "@/lib/feed-server";
import { Suspense } from "react";

export default async function Page() {
  const feedItems = await getFeedItemsFromDB(7);

  return (
    <div className="flex gap-10 container py-10">
      <div className="w-56 sticky top-[calc(theme(spacing.header)+theme(spacing.10))] h-[calc(100dvh-theme(spacing.header-theme(spacing.10))))] overflow-y-auto">
        <h2 className="mb-6">絞り込み</h2>
        <Suspense>
          <FeedFilter feedItems={feedItems} />
        </Suspense>
      </div>
      <div className="flex-1">
        {/* <textarea value={JSON.stringify(feedItems, null, 2)} /> */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold">過去7日間の更新</h1>
          <p className="text-sm text-muted-foreground mb-4">
            最終更新: <RecencyDate date={Date.now()} />
          </p>
        </div>

        {feedItems.length === 0 ? (
          <div>
            <p className="text-muted-foreground">更新情報はありません</p>
            <FetchFeedButton />
          </div>
        ) : (
          <Suspense>
            <FeedList feedItems={feedItems} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
