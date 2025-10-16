import { FeedFilter } from "@/components/feed-filter";
import { FeedList } from "@/components/feed-list";
import { RecencyDate } from "@/components/recency-date";
import { RefreshFeedButton } from "@/components/refresh-feed-button";
import { RegenerateMissingSummariesButton } from "@/components/regenerate-missing-summaries-button";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@workspace/ui/components/empty";
import {
  getFeedItemsFromDB,
  getItemsWithMissingSummary,
} from "@/lib/feed-server";
import { RefreshCw } from "lucide-react";
import { Suspense } from "react";

export default async function Page() {
  const feedItems = await getFeedItemsFromDB(7);
  const itemsWithMissingSummary = await getItemsWithMissingSummary();

  return (
    <div className="flex gap-4 container items-start">
      <div className="sticky top-header">
        <div className="w-64 overflow-y-auto h-[calc(100dvh-theme(spacing.header))] py-10 pr-6">
          <h2 className="mb-6">絞り込み</h2>
          <Suspense>
            <FeedFilter feedItems={feedItems} />
          </Suspense>
        </div>
      </div>
      <div className="flex-1 py-10">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold">過去7日間の更新</h1>
          <p className="text-sm text-muted-foreground mb-4">
            最終更新: <RecencyDate date={Date.now()} />
          </p>
          <div className="flex gap-2 flex-wrap">
            <RefreshFeedButton />
            <RegenerateMissingSummariesButton
              missingCount={itemsWithMissingSummary.length}
            />
          </div>
        </div>

        {feedItems.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <RefreshCw />
              </EmptyMedia>
              <EmptyTitle>更新情報はありません</EmptyTitle>
              <EmptyDescription>
                過去7日間に更新されたフィードアイテムがありません。
                {process.env.NODE_ENV === "development" && (
                  <>
                    <br />
                    開発環境では手動でフィードを更新できます。
                  </>
                )}
              </EmptyDescription>
            </EmptyHeader>
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4">
                <RefreshFeedButton />
              </div>
            )}
          </Empty>
        ) : (
          <Suspense>
            <FeedList feedItems={feedItems} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
