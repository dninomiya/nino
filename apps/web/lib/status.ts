import "server-only";

export type Provider = {
  name: "Resend" | "Vercel" | "Turso";
  rss: string;
  link: string;
};

export const providers: readonly Provider[] = [
  {
    name: "Resend",
    rss: "https://resend-status.com/feed.atom",
    link: "https://resend-status.com/",
  },
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
] as const;

export type ProviderName = (typeof providers)[number]["name"];
