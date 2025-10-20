import { DISCORD_WEBHOOK_URLS } from "@workspace/discord";

export const dynamic = "force-dynamic";

function colorOf(status?: string) {
  switch (status) {
    case "resolved":
      return 0x00ff99;
    case "monitoring":
    case "identified":
    case "investigating":
      return 0xff9900;
    default:
      return 0x5865f2; // discord blurple
  }
}

export async function POST(req: Request) {
  try {
    // ① Statuspage の JSON を受け取る
    const body = await req.json().catch(() => ({}) as any);
    const incident = body?.incident ?? {};
    const page = body?.page ?? {};

    const title = incident.name ?? "Statuspage incident";
    const status = incident.status ?? "unknown";
    const url = incident.shortlink ?? page?.url ?? undefined;
    const desc =
      incident.incident_updates?.[0]?.body ?? "See incident page for details.";

    // ② Discord へ整形して転送
    const payload = {
      username: "Statuspage",
      embeds: [
        {
          title: `📢 ${title}`,
          description: `**Status:** ${status}\n\n${desc}`,
          url,
          color: colorOf(status),
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const resp = await fetch(DISCORD_WEBHOOK_URLS.techNews, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("Discord webhook error:", resp.status, text);
      return new Response("failed to post to discord", { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return new Response("error", { status: 500 });
  }
}
