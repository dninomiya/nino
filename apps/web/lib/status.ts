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
] as const;

export type ProviderName = (typeof providers)[number]["name"];
