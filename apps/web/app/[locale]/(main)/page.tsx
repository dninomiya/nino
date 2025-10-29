"use cache: private";

import { FeedFilter } from "@/components/feed-filter";
import { FeedList } from "@/components/feed-list";
import { Footer } from "@/components/footer";
import { RecencyDate } from "@/components/recency-date";
import { RefreshFeedButton } from "@/components/refresh-feed-button";
import { TestDiscordNotificationButton } from "@/components/test-discord-notification-button";
import { getFeedItemsFromDB } from "@/lib/feed-server";
import {
  getCurrentLocale,
  getMessage,
  setCurrentLocaleFromParams,
} from "@/lib/i18n/server";
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
  const locale = getCurrentLocale();

  return (
    <>
      <div className="xl:flex gap-10 items-start px-4 xl:px-8">
        <div className="sticky top-header hidden xl:block">
          <div className="w-80 overflow-y-auto h-[calc(100dvh-(var(--spacing-header)))] py-10">
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
              {t.lastUpdated}: <RecencyDate date={Date.now()} locale={locale} />
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
        {/* <div className="hidden xl:block w-80 py-10">
          <a
            className="twitter-timeline"
            data-chrome="transparent nofooter noheader"
            href="https://twitter.com/d151005?ref_src=twsrc%5Etfw"
          >
            Tweets by d151005
          </a>{" "}
          <script async src="https://platform.twitter.com/widgets.js"></script>
        </div> */}
      </div>
      <Footer />
    </>
  );
}
