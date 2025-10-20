import { getLatestStatuses, getStatusEvents } from "@/lib/status-server";
import { debugRunStatusCron } from "./actions";

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
        {latest.map((p: any) => (
          <div key={p.provider} className="rounded-md border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-medium">{p.provider}</div>
              <span
                className={`text-xs rounded px-2 py-1 border ${badgeClass(p.status)}`}
              >
                {p.status}
              </span>
            </div>
            {p.description && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {p.description}
              </p>
            )}
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">直近の経緯</h2>
        <div className="space-y-3">
          {events.map((e: any) => (
            <div key={e.id} className="rounded-md border p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs rounded px-2 py-1 border ${badgeClass(e.status)}`}
                  >
                    {e.status}
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
              <div className="mt-2 font-medium">
                {e.provider}
                {e.title ? ` - ${e.title}` : ""}
              </div>
              {e.description && (
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                  {e.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function badgeClass(status: string) {
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
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}
