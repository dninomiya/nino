import { Node, Edge } from "@xyflow/react";

export interface ArchitectureNodeData {
  label: string;
  type: "app" | "package" | "database" | "external" | "baas";
  description?: string;
  technologies?: string[];
  dependencies?: string[];
  [key: string]: unknown;
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
      technologies: ["Next.js 16", "Tailwind CSS"],
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
      description: "Drizzle ORM によるDB接続・スキーマ管理・マイグレーション",
      technologies: ["Drizzle ORM", "SQLite", "Zod"],
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
      technologies: ["Better Auth"],
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
      technologies: ["Tailwind CSS", "Radix UI"],
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
      technologies: [],
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
      technologies: ["Discord.js"],
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
      technologies: ["Next.js"],
      dependencies: ["@workspace/ui"],
    },
  },

  // データベースグループ
  {
    id: "database-group",
    type: "group",
    position: { x: 650, y: 20 },
    style: {
      width: 250,
      height: 220,
      backgroundColor: "rgba(139, 92, 246, 0.1)",
      border: "2px solid rgba(139, 92, 246, 0.3)",
      borderRadius: "12px",
    },
    data: {
      label: "Database",
      type: "database",
      description: "データベーステーブルグループ",
    },
  },

  // データベーステーブルノード（グループ内）
  {
    id: "feed-items-table",
    type: "custom",
    position: { x: 20, y: 60 },
    parentId: "database-group",
    extent: "parent",
    data: {
      label: "feed_items",
      type: "database",
      description: "RSSフィードアイテムテーブル",
      technologies: [],
      dependencies: [],
    },
  },
  {
    id: "status-events-table",
    type: "custom",
    position: { x: 20, y: 120 },
    parentId: "database-group",
    extent: "parent",
    data: {
      label: "status_events",
      type: "database",
      description: "ステータス変更履歴テーブル",
      technologies: [],
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

  // BaaSサービスノード
  {
    id: "turso",
    type: "custom",
    position: { x: 1000, y: 50 },
    data: {
      label: "Turso",
      type: "baas",
      description: "SQLiteベースのデータベースサービス",
      dependencies: [],
    },
  },
  {
    id: "vercel",
    type: "custom",
    position: { x: 1000, y: 200 },
    data: {
      label: "Vercel",
      type: "baas",
      description: "ホスティング・デプロイメントサービス",
      dependencies: [],
    },
  },
  {
    id: "stripe",
    type: "custom",
    position: { x: 1000, y: 350 },
    data: {
      label: "Stripe",
      type: "baas",
      description: "決済処理サービス",
      dependencies: [],
    },
  },
  {
    id: "resend",
    type: "custom",
    position: { x: 1000, y: 500 },
    data: {
      label: "Resend",
      type: "baas",
      description: "メール送信サービス",
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
    label: "Drizzle ORM",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: { stroke: "#3b82f6", strokeWidth: 2 },
  },
  {
    id: "db-to-status-events",
    source: "db-package",
    target: "status-events-table",
    type: "smoothstep",
    label: "Drizzle ORM",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: { stroke: "#3b82f6", strokeWidth: 2 },
  },

  // データベーステーブルからTursoへの接続
  {
    id: "feed-items-to-turso",
    source: "feed-items-table",
    target: "turso",
    type: "smoothstep",
    label: "SQLite",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: { stroke: "#10b981", strokeWidth: 2 },
    animated: true,
  },
  {
    id: "status-events-to-turso",
    source: "status-events-table",
    target: "turso",
    type: "smoothstep",
    label: "SQLite",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: { stroke: "#10b981", strokeWidth: 2 },
    animated: true,
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

  // BaaSサービスからWeb Appへの接続
  {
    id: "turso-to-web",
    source: "turso",
    target: "web-app",
    type: "smoothstep",
    label: "Drizzle Connection",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: { stroke: "#8b5cf6", strokeWidth: 2 },
    animated: true,
  },
  {
    id: "vercel-to-web",
    source: "vercel",
    target: "web-app",
    type: "smoothstep",
    animated: true,
  },
  {
    id: "stripe-to-web",
    source: "stripe",
    target: "web-app",
    type: "smoothstep",
    animated: true,
  },
  {
    id: "resend-to-web",
    source: "resend",
    target: "web-app",
    type: "smoothstep",
    animated: true,
  },
];
