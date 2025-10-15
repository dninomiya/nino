export const revalidate = 14400; // 4 hours

import { RecencyDate } from "@/components/recency-date";
import { getFeedItems } from "@/lib/feed";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

const isDevelopment = process.env.NODE_ENV === "development";

export default async function Page() {
  const feedItems = isDevelopment ? [] : await getFeedItems(7);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">過去7日間の更新</h1>
        <p className="text-sm text-muted-foreground mb-4">
          最終更新: <RecencyDate date={Date.now()} />
        </p>
      </div>

      {feedItems.length === 0 ? (
        <p className="text-muted-foreground">更新情報はありません</p>
      ) : (
        <div className="space-y-4">
          {feedItems.map((item, index) => (
            <div
              key={`${item.url}-${index}`}
              className="border rounded-lg p-4 hover:bg-accent transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold hover:underline block mb-2"
                  >
                    {item.title}
                  </a>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center">
                      {format(item.date, "yyyy年MM月dd日 HH:mm", {
                        locale: ja,
                      })}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {item.category}
                    </span>
                    <span>•</span>
                    <span>{item.source}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
