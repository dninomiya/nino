import "server-only";

export const providers = [
  {
    name: "Vercel",
    rss: "https://www.vercel-status.com/history.atom",
    link: "https://www.vercel-status.com/",
  },
  {
    name: "Turso",
    rss: "https://status.turso.tech/feed.atom",
    link: "https://status.turso.tech/",
  },
  {
    name: "Stripe",
    rss: "https://www.stripestatus.com/history.atom",
    link: "https://www.stripestatus.com/",
  },
  {
    name: "Resend",
    rss: "https://resend-status.com/feed.atom",
    link: "https://resend-status.com/",
  },
  {
    name: "GitHub",
    rss: "https://www.githubstatus.com/history.atom",
    link: "https://www.githubstatus.com",
  },
  {
    name: "Notion",
    rss: "https://www.notion-status.com/history.atom",
    link: "https://www.notion-status.com/#",
  },
  {
    name: "Discord",
    rss: "https://discordstatus.com/history.atom",
    link: "https://discordstatus.com/#",
  },
  {
    name: "Supabase",
    rss: "https://status.supabase.com/history.atom",
    link: "https://status.supabase.com/#",
  },
  {
    name: "Convex",
    rss: "https://status.convex.dev/history.atom",
    link: "https://status.convex.dev/#",
  },
  {
    name: "Cloudflare",
    rss: "https://www.cloudflarestatus.com/history.atom",
    link: "https://www.cloudflarestatus.com/",
  },
] as const;

export type ProviderName = (typeof providers)[number]["name"];
