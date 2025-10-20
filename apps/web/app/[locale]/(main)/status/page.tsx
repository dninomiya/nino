import { getLatestStatuses, getStatusEvents } from "@/lib/status-server";
import { debugRunStatusCron } from "./actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { TECHNOLOGIES } from "@workspace/lib/technologies";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import {
  statusLatest,
  statusEvents,
  type NormalizedStatus,
} from "@workspace/db/schemas/status";
import type { ProviderName } from "@/lib/status";
import { providers } from "@/lib/status";

// 型定義
type StatusLatest = typeof statusLatest.$inferSelect;
type StatusEvent = typeof statusEvents.$inferSelect;

// StatusLatestにlinkプロパティを追加した型
type StatusLatestWithLink = StatusLatest & { link?: string };

// プロバイダー名からリンクを取得する関数
function getProviderLink(providerName: ProviderName): string {
  const provider = providers.find((p) => p.name === providerName);
  return provider?.link || "#";
}

// ステータスを日本語に変換する関数
function getStatusText(status: NormalizedStatus) {
  switch (status) {
    case "normal":
      return "正常";
    case "degraded":
      return "低下";
    case "partial":
      return "部分障害";
    case "major":
      return "重大障害";
    case "maintenance":
      return "メンテナンス";
    case "unknown":
      return "不明";
    default:
      return status;
  }
}

export default async function StatusPage() {
  const [latest, events] = await Promise.all([
    getLatestStatuses(),
    getStatusEvents({
      from: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    }),
  ]);

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">サービスステータス</h1>
        <p className="text-sm text-muted-foreground">
          直近の更新と各サービスの現在状態を表示します
        </p>
        <form
          action={async () => {
            "use server";
            await debugRunStatusCron();
          }}
        >
          <button
            type="submit"
            className="mt-2 inline-flex items-center rounded-md border px-3 py-1 text-sm"
          >
            ステータス更新を手動実行
          </button>
        </form>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {latest.map((p: StatusLatestWithLink) => {
          const techInfo =
            TECHNOLOGIES[p.provider as keyof typeof TECHNOLOGIES];
          const IconComponent = techInfo?.icon;

          return (
            <Card key={p.provider}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {IconComponent && (
                      <IconComponent className="h-5 w-5 text-muted-foreground" />
                    )}
                    <CardTitle className="text-base">{p.provider}</CardTitle>
                  </div>
                  <span
                    className={`text-xs rounded px-2 py-1 font-semibold border ${badgeClass(p.status as NormalizedStatus)}`}
                  >
                    {getStatusText(p.status as NormalizedStatus)}
                  </span>
                </div>
              </CardHeader>
              {p.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {p.description}
                  </p>
                </CardContent>
              )}
              <CardFooter>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={getProviderLink(p.provider as ProviderName)}
                    target="_blank"
                  >
                    詳細
                    <ArrowUpRight />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">直近の経緯</h2>
        <div className="space-y-3">
          {events.map((e: StatusEvent) => (
            <Card key={e.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs rounded px-2 py-1 border ${badgeClass(e.status as NormalizedStatus)}`}
                    >
                      {getStatusText(e.status as NormalizedStatus)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(e.occurredAt).toLocaleString("ja-JP")}
                    </span>
                  </div>
                  {e.link && (
                    <a
                      className="text-sm underline"
                      href={e.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      詳細
                    </a>
                  )}
                </div>
                <CardTitle className="text-base">
                  {e.provider}
                  {e.title ? ` - ${e.title}` : ""}
                </CardTitle>
              </CardHeader>
              {e.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {e.description}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function badgeClass(status: NormalizedStatus) {
  switch (status) {
    case "normal":
      return "bg-green-50 text-green-700 border-green-200";
    case "degraded":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "partial":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "major":
      return "bg-red-50 text-red-700 border-red-200";
    case "maintenance":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "unknown":
      return "bg-gray-50 text-gray-700 border-gray-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}
