import { Node, Edge } from "@xyflow/react";

export interface ArchitectureNodeData {
  label: string;
  type: "app" | "package" | "database" | "external";
  description?: string;
  technologies?: string[];
  dependencies?: string[];
}

export const initialNodes: Node<ArchitectureNodeData>[] = [
  // アプリケーションノード
  {
    id: "web-app",
    type: "custom",
    position: { x: 100, y: 100 },
    data: {
      label: "Web App",
      type: "app",
      description: "Next.js 16 メインアプリケーション",
      technologies: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"],
      dependencies: [
        "@workspace/db",
        "@workspace/auth",
        "@workspace/ui",
        "@workspace/lib",
        "@workspace/discord",
        "@workspace/registry",
      ],
    },
  },

  // パッケージノード
  {
    id: "db-package",
    type: "custom",
    position: { x: 400, y: 50 },
    data: {
      label: "Database Package",
      type: "package",
      description: "Drizzle ORM, スキーマ, マイグレーション",
      technologies: ["Drizzle ORM", "SQLite", "Zod", "TypeScript"],
      dependencies: [],
    },
  },
  {
    id: "auth-package",
    type: "custom",
    position: { x: 400, y: 150 },
    data: {
      label: "Auth Package",
      type: "package",
      description: "Better Auth 認証システム",
      technologies: ["Better Auth", "TypeScript"],
      dependencies: ["@workspace/db"],
    },
  },
  {
    id: "ui-package",
    type: "custom",
    position: { x: 400, y: 250 },
    data: {
      label: "UI Package",
      type: "package",
      description: "共有UIコンポーネント",
      technologies: ["React", "Tailwind CSS", "Radix UI", "TypeScript"],
      dependencies: [],
    },
  },
  {
    id: "lib-package",
    type: "custom",
    position: { x: 400, y: 350 },
    data: {
      label: "Lib Package",
      type: "package",
      description: "定数、ユーティリティ",
      technologies: ["TypeScript"],
      dependencies: [],
    },
  },
  {
    id: "discord-package",
    type: "custom",
    position: { x: 400, y: 450 },
    data: {
      label: "Discord Package",
      type: "package",
      description: "Discord通知システム",
      technologies: ["Discord.js", "TypeScript"],
      dependencies: [],
    },
  },
  {
    id: "registry-package",
    type: "custom",
    position: { x: 400, y: 550 },
    data: {
      label: "Registry Package",
      type: "package",
      description: "レジストリシステム",
      technologies: ["Next.js", "React", "TypeScript"],
      dependencies: ["@workspace/ui"],
    },
  },

  // データベーステーブルノード
  {
    id: "feed-items-table",
    type: "custom",
    position: { x: 700, y: 50 },
    data: {
      label: "feed_items",
      type: "database",
      description: "RSSフィードアイテムテーブル",
      technologies: ["SQLite", "Drizzle ORM"],
      dependencies: [],
    },
  },
  {
    id: "status-events-table",
    type: "custom",
    position: { x: 700, y: 150 },
    data: {
      label: "status_events",
      type: "database",
      description: "ステータス変更履歴テーブル",
      technologies: ["SQLite", "Drizzle ORM"],
      dependencies: [],
    },
  },

  // 外部サービスノード
  {
    id: "rss-feeds",
    type: "custom",
    position: { x: 100, y: 300 },
    data: {
      label: "RSS Feeds",
      type: "external",
      description: "外部RSSフィード",
      technologies: ["RSS", "XML"],
      dependencies: [],
    },
  },
  {
    id: "discord-api",
    type: "custom",
    position: { x: 100, y: 400 },
    data: {
      label: "Discord API",
      type: "external",
      description: "Discord Webhook API",
      technologies: ["Discord API", "Webhooks"],
      dependencies: [],
    },
  },
  {
    id: "ai-gateway",
    type: "custom",
    position: { x: 100, y: 500 },
    data: {
      label: "AI Gateway",
      type: "external",
      description: "AI要約サービス",
      technologies: ["AI API", "OpenAI"],
      dependencies: [],
    },
  },
];

export const initialEdges: Edge[] = [
  // Web App から各パッケージへの依存関係
  {
    id: "web-to-db",
    source: "web-app",
    target: "db-package",
    type: "smoothstep",
    animated: true,
  },
  {
    id: "web-to-auth",
    source: "web-app",
    target: "auth-package",
    type: "smoothstep",
    animated: true,
  },
  {
    id: "web-to-ui",
    source: "web-app",
    target: "ui-package",
    type: "smoothstep",
    animated: true,
  },
  {
    id: "web-to-lib",
    source: "web-app",
    target: "lib-package",
    type: "smoothstep",
    animated: true,
  },
  {
    id: "web-to-discord",
    source: "web-app",
    target: "discord-package",
    type: "smoothstep",
    animated: true,
  },
  {
    id: "web-to-registry",
    source: "web-app",
    target: "registry-package",
    type: "smoothstep",
    animated: true,
  },

  // パッケージ間の依存関係
  {
    id: "auth-to-db",
    source: "auth-package",
    target: "db-package",
    type: "smoothstep",
  },
  {
    id: "registry-to-ui",
    source: "registry-package",
    target: "ui-package",
    type: "smoothstep",
  },

  // データベーステーブルへの接続
  {
    id: "db-to-feed-items",
    source: "db-package",
    target: "feed-items-table",
    type: "smoothstep",
  },
  {
    id: "db-to-status-events",
    source: "db-package",
    target: "status-events-table",
    type: "smoothstep",
  },

  // 外部サービスからのデータフロー
  {
    id: "rss-to-feed-items",
    source: "rss-feeds",
    target: "feed-items-table",
    type: "smoothstep",
    animated: true,
  },
  {
    id: "discord-to-discord-pkg",
    source: "discord-api",
    target: "discord-package",
    type: "smoothstep",
    animated: true,
  },
  {
    id: "ai-to-web",
    source: "ai-gateway",
    target: "web-app",
    type: "smoothstep",
    animated: true,
  },
];
