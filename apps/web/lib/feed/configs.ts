import {
  SiNextdotjs,
  SiReact,
  SiResend,
  SiGithub,
  SiTurso,
  SiRaycast,
  SiNotion,
  SiDrizzle,
  SiStripe,
  SiReacthookform,
  SiTailwindcss,
  SiVercel,
  SiOpenai,
  SiGoogle,
  SiGooglechrome,
  SiExpo,
  SiSwr,
  SiTurborepo,
  SiDiscord,
  SiLucide,
  SiCloudflare,
} from "@icons-pack/react-simple-icons";
import { FeedCollection } from "./types";
import { Code, MousePointer2 } from "lucide-react";

export const collections: FeedCollection[] = [
  {
    name: "Next.js",
    icon: SiNextdotjs,
    category: "framework",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/vercel/next.js/releases.atom",
        type: "releases",
      },
      {
        method: "rss",
        url: "https://nextjs.org/feed.xml",
        type: "blog",
      },
    ],
  },
  {
    name: "Vercel",
    icon: SiVercel,
    category: "saas",
    feeds: [
      {
        method: "rss",
        url: "https://vercel.com/atom",
        type: "blog",
      },
      {
        method: "rss",
        url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCLq8gNoee7oXM7MvTdjyQvA",
        type: "changelog",
      },
      {
        method: "rss",
        url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCLq8gNoee7oXM7MvTdjyQvA",
        type: "youtube",
      },
    ],
  },
  {
    name: "React",
    icon: SiReact,
    category: "framework",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/facebook/react/releases.atom",
        type: "releases",
      },
      {
        method: "rss",
        url: "https://react.dev/rss.xml",
        type: "blog",
      },
      {
        method: "rss",
        url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC1hOCRBN2mnXgN5reSoO3pQ",
        type: "youtube",
      },
    ],
  },
  {
    name: "Resend",
    icon: SiResend,
    category: "saas",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/resend/resend-node/releases.atom",
        type: "releases",
      },
      {
        method: "rss",
        url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC0FkhoSz2kYqHVBk4L0QYIg",
        type: "youtube",
      },
    ],
  },
  {
    name: "Better Auth",
    icon: SiGithub,
    category: "library",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/better-auth/better-auth/releases.atom",
        type: "releases",
      },
    ],
  },
  {
    name: "Turso",
    icon: SiTurso,
    category: "saas",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/tursodatabase/libsql/releases.atom",
        type: "releases",
      },
      {
        method: "rss",
        url: "https://turso.tech/blog/feed.xml",
        type: "blog",
      },
    ],
  },
  {
    name: "Raycast",
    icon: SiRaycast,
    category: "tool",
    feeds: [
      {
        method: "rss",
        url: "https://www.raycast.com/rss/feed.xml",
        type: "blog",
      },
      {
        method: "rss",
        url: "https://www.raycast.com/changelog/feed.xml",
        type: "changelog",
      },
      {
        method: "rss",
        url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCPvOHaaP9E6FqSqG1NMV_Hw",
        type: "youtube",
      },
    ],
  },
  {
    name: "Notion",
    icon: SiNotion,
    category: "tool",
    feeds: [
      {
        method: "rss",
        url: "https://www.notion.com/ja/releases/rss.xml",
        type: "releases",
      },
    ],
  },
  {
    name: "Drizzle",
    icon: SiDrizzle,
    category: "library",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/drizzle-team/drizzle-orm/releases.atom",
        type: "releases",
      },
    ],
  },
  {
    name: "Stripe",
    icon: SiStripe,
    category: "saas",
    feeds: [
      {
        method: "rss",
        url: "https://stripe.com/blog/feed.rss",
        type: "blog",
      },
    ],
  },
  {
    name: "nuqs",
    icon: SiGithub,
    category: "library",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/47ng/nuqs/releases.atom",
        type: "releases",
      },
      {
        method: "rss",
        url: "https://nuqs.dev/blog/rss.xml",
        type: "blog",
      },
    ],
  },
  {
    name: "React Hook Form",
    icon: SiReacthookform,
    category: "library",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/react-hook-form/react-hook-form/releases.atom",
        type: "releases",
      },
    ],
  },
  {
    name: "AI SDK",
    icon: SiVercel,
    category: "library",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/vercel/ai/releases.atom",
        type: "releases",
      },
    ],
  },
  {
    name: "shadcn/ui",
    icon: SiGithub,
    category: "library",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/shadcn-ui/ui/releases.atom",
        type: "releases",
      },
    ],
  },
  {
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    category: "library",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/tailwindlabs/tailwindcss/releases.atom",
        type: "releases",
      },
      {
        method: "rss",
        url: "https://tailwindcss.com/feeds/feed.xml",
        type: "blog",
      },
      {
        method: "rss",
        url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCOe-8z68tgw9ioqVvYM4ddQ",
        type: "youtube",
      },
    ],
  },
  {
    name: "OpenAI",
    icon: SiOpenai,
    category: "ai",
    feeds: [
      {
        method: "rss",
        url: "https://openai.com/news/rss.xml",
        type: "blog",
      },
      {
        method: "rss",
        url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCXZCJLdBC09xxGZ6gcdrc6A",
        type: "youtube",
      },
    ],
  },
  {
    name: "Anthropic",
    icon: SiGithub,
    category: "ai",
    feeds: [
      {
        method: "rss",
        url: "https://rsshub.app/anthropic/news",
        type: "blog",
      },
      {
        method: "rss",
        url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCrDwWp7EBBv4NwvScIpBDOA",
        type: "youtube",
      },
    ],
  },
  // {
  //   name: "xAI",
  //   icon: SiGithub,
  //   category: "AI",
  //   feeds: [
  //     {
  //       method: "rss",
  //       url: "https://x.ai/blog/rss.xml",
  //       type: "blog",
  //     },
  //   ],
  // },
  {
    name: "Google AI",
    icon: SiGoogle,
    category: "ai",
    feeds: [
      {
        method: "rss",
        url: "https://blog.google/products/gemini/rss/",
        type: "blog",
      },
    ],
  },
  {
    name: "Cursor",
    icon: MousePointer2,
    category: "tool",
    feeds: [
      {
        method: "rss",
        url: "https://cursor.com/atom.xml",
        type: "blog",
      },
      {
        method: "rss",
        url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC6YYHJzM6PhZ2Yey9BQiUaw",
        type: "youtube",
      },
    ],
  },
  {
    name: "Chrome",
    icon: SiGooglechrome,
    category: "tool",
    feeds: [
      {
        method: "rss",
        url: "https://blog.google/products/chrome/rss/",
        type: "blog",
      },
      {
        method: "rss",
        url: "https://developer.chrome.com/static/blog/feed.xml",
        type: "blog",
      },
      {
        method: "rss",
        url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCnUYZLuoy1rq1aVMwx4aTzw",
        type: "youtube",
      },
    ],
  },
  {
    name: "Expo",
    icon: SiExpo,
    category: "mobile",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/expo/expo/commits/main/CHANGELOG.md.atom",
        type: "releases",
      },
      {
        method: "rss",
        url: "https://blog.expo.dev/feed",
        type: "blog",
      },
    ],
  },
  {
    name: "React Native",
    icon: SiReact,
    category: "mobile",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/facebook/react-native/releases.atom",
        type: "releases",
      },
      {
        method: "rss",
        url: "https://reactnative.dev/blog/atom.xml",
        type: "blog",
      },
    ],
  },
  {
    name: "Visual Studio Code",
    icon: Code,
    category: "tool",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/microsoft/vscode/releases.atom",
        type: "releases",
      },
      {
        method: "rss",
        url: "https://code.visualstudio.com/feed.xml",
        type: "blog",
      },
    ],
  },
  {
    name: "SWR",
    icon: SiSwr,
    category: "library",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/vercel/swr/releases.atom",
        type: "releases",
      },
    ],
  },
  {
    name: "Turborepo",
    icon: SiTurborepo,
    category: "tool",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/vercel/turborepo/releases.atom",
        type: "releases",
      },
      {
        method: "rss",
        url: "https://turborepo.com/feed.xml",
        type: "blog",
      },
    ],
  },
  {
    name: "Discord",
    icon: SiDiscord,
    category: "tool",
    feeds: [
      {
        method: "rss",
        url: "https://discord.com/blog/rss.xml",
        type: "blog",
      },
      {
        method: "rss",
        url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCZ5XnGb-3t7jCkXdawN2tkA",
        type: "youtube",
      },
    ],
  },
  {
    name: "Lucide",
    icon: SiLucide,
    category: "library",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/lucide-icons/lucide/releases.atom",
        type: "releases",
      },
    ],
  },
  {
    name: "Cloudflare",
    icon: SiCloudflare,
    category: "saas",
    feeds: [
      {
        method: "rss",
        url: "https://developers.cloudflare.com/changelog/rss/index.xml",
        type: "changelog",
      },
    ],
  },
];
