import { Button } from "@/components/ui/button";
import { getMessage, setCurrentLocaleFromParams } from "@/lib/i18n/server";
import type { ProviderName } from "@/lib/status";
import { providers } from "@/lib/status";
import { getLatestStatuses, getStatusEvents } from "@/lib/status-server";
import { formatDateByRecency } from "@/lib/util";
import {
  statusEvents,
  type NormalizedStatus,
} from "@workspace/db/schemas/status";
import { TECHNOLOGIES } from "@workspace/lib/technologies";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ArrowUpRight } from "lucide-react";
import { debugRunStatusCron } from "./actions";
import { Footer } from "@/components/footer";

// 型定義
type StatusEvent = typeof statusEvents.$inferSelect;

// プロバイダー名からリンクを取得する関数
function getProviderLink(providerName: ProviderName): string {
  const provider = providers.find((p) => p.name === providerName);
  return provider?.link || "#";
}

// ステータスに応じた絵文字を取得する関数
function getStatusEmoji(status: NormalizedStatus) {
  switch (status) {
    case "normal":
      return "✅";
    case "degraded":
      return "⚠️";
    case "partial":
      return "🟡";
    case "major":
      return "🚨";
    case "maintenance":
      return "🔧";
    case "unknown":
      return "❓";
    default:
      return "❓";
  }
}

// ステータスをテキストに変換する関数
function getStatusText(status: NormalizedStatus, t: any) {
  switch (status) {
    case "normal":
      return t.statusNormal;
    case "degraded":
      return t.statusDegraded;
    case "partial":
      return t.statusPartial;
    case "major":
      return t.statusMajor;
    case "maintenance":
      return t.statusMaintenance;
    case "unknown":
      return t.statusUnknown;
    default:
      return status;
  }
}

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
  await setCurrentLocaleFromParams(params);
  const t = await getMessage("StatusPage");
  return {
    title: t.title,
    description: t.description,
  };
}

export default async function StatusPage({ params }: PageProps<"/[locale]">) {
  const locale = await setCurrentLocaleFromParams(params);
  const t = await getMessage("StatusPage");
  const [latest, events] = await Promise.all([
    getLatestStatuses(),
    getStatusEvents({
      from: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    }),
  ]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <>
      <div className="container mx-auto px-4 py-6 space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">{t.pageTitle}</h1>
          <p className="text-sm text-muted-foreground">{t.pageDescription}</p>
          {isDev && (
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
                {t.manualUpdateButton}
              </button>
            </form>
          )}
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((p: StatusEvent) => {
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
                      {getStatusText(p.status as NormalizedStatus, t)}
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
                      {t.details}
                      <ArrowUpRight />
                    </a>
                  </Button>
                  <p
                    className="text-sm text-muted-foreground ml-2"
                    title={p.occurredAt.toISOString()}
                  >
                    {formatDateByRecency(p.occurredAt, locale)}
                  </p>
                </CardFooter>
              </Card>
            );
          })}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">{t.recentHistory}</h2>
          <div className="space-y-4">
            {events.map((e: StatusEvent) => {
              const techInfo =
                TECHNOLOGIES[e.provider as keyof typeof TECHNOLOGIES];
              const IconComponent = techInfo?.icon;

              return (
                <div key={e.id} className="border-l-4 border-muted pl-4 py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {IconComponent && (
                        <IconComponent className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-semibold">{e.provider}</span>
                    </div>
                    <span
                      className={`text-xs rounded px-2 py-1 font-semibold border ${badgeClass(e.status as NormalizedStatus)}`}
                    >
                      {getStatusText(e.status as NormalizedStatus, t)}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">
                        ({formatDateByRecency(e.occurredAt, locale)})
                      </span>
                      {e.link && (
                        <a
                          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                          href={e.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t.details}
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  {e.description && (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {e.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <Footer />
    </>
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
