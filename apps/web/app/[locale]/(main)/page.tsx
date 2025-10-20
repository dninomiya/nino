import { FeedFilter } from "@/components/feed-filter";
import { FeedList } from "@/components/feed-list";
import { RecencyDate } from "@/components/recency-date";
import { RefreshFeedButton } from "@/components/refresh-feed-button";
import { TestDiscordNotificationButton } from "@/components/test-discord-notification-button";
import { getFeedItemsFromDB } from "@/lib/feed-server";
import { getMessage, setCurrentLocaleFromParams } from "@/lib/i18n/server";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty";
import { RefreshCw } from "lucide-react";
import { Suspense } from "react";

export default async function Page({ params }: PageProps<"/[locale]">) {
  await setCurrentLocaleFromParams(params);
  const feedItems = await getFeedItemsFromDB(7);
  const t = await getMessage("MainPage");

  return (
    <div className="xl:flex gap-4 container items-start">
      <div className="sticky top-header hidden xl:block">
        <div className="w-80 overflow-y-auto h-[calc(100dvh-theme(spacing.header))] py-10 pr-6">
          <h2 className="mb-6">{t.filterTitle}</h2>
          <Suspense>
            <FeedFilter feedItems={feedItems} />
          </Suspense>
        </div>
      </div>
      <div className="flex-1 py-10">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold">{t.feedTitle}</h1>
          <p>{t.feedDescription}</p>
          <p className="text-sm text-muted-foreground mb-4">
            {t.lastUpdated}: <RecencyDate date={Date.now()} />
          </p>
          <div className="flex gap-2 flex-wrap">
            {process.env.NODE_ENV === "development" && (
              <>
                <TestDiscordNotificationButton />
                <RefreshFeedButton />
              </>
            )}
          </div>
        </div>

        {feedItems.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <RefreshCw />
              </EmptyMedia>
              <EmptyTitle>{t.noUpdates}</EmptyTitle>
              <EmptyDescription>
                {t.noUpdatesDescription}
                {process.env.NODE_ENV === "development" && (
                  <>
                    <br />
                    {t.noUpdatesDevNote}
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
