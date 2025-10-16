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
} from "@icons-pack/react-simple-icons";
import { FeedCollection } from "./types";

export const collections: FeedCollection[] = [
  {
    name: "Next.js",
    icon: SiNextdotjs,
    category: "フレームワーク",
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
    category: "SaaS/BaaS",
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
    ],
  },
  {
    name: "React",
    icon: SiReact,
    category: "フレームワーク",
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
    category: "SaaS/BaaS",
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
    category: "ライブラリ",
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
    category: "SaaS/BaaS",
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
    category: "ツール",
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
    category: "ツール",
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
    category: "ライブラリ",
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
    category: "SaaS/BaaS",
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
    category: "ライブラリ",
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
    category: "ライブラリ",
    feeds: [
      {
        method: "rss",
        url: "https://github.com/react-hook-form/react-hook-form/releases.atom",
        type: "releases",
      },
    ],
  },
  {
    name: "shadcn/ui",
    icon: SiGithub,
    category: "ライブラリ",
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
    category: "ライブラリ",
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
];
