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
    sourceHandle: "out",
    target: "db-package",
    targetHandle: "in",
    type: "smoothstep",
    label: "import",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: { stroke: "#3b82f6", strokeWidth: 3 },
    animated: true,
    markerEnd: {
      type: "arrowclosed",
      color: "#3b82f6",
    },
  },
  {
    id: "web-to-auth",
    source: "web-app",
    sourceHandle: "out",
    target: "auth-package",
    targetHandle: "in",
    type: "smoothstep",
    label: "import",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: { stroke: "#3b82f6", strokeWidth: 3 },
    animated: true,
    markerEnd: {
      type: "arrowclosed",
      color: "#3b82f6",
    },
  },
  {
    id: "web-to-ui",
    source: "web-app",
    sourceHandle: "out",
    target: "ui-package",
    targetHandle: "in",
    type: "smoothstep",
    label: "import",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: { stroke: "#3b82f6", strokeWidth: 3 },
    animated: true,
    markerEnd: {
      type: "arrowclosed",
      color: "#3b82f6",
    },
  },
  {
    id: "web-to-lib",
    source: "web-app",
    sourceHandle: "out",
    target: "lib-package",
    targetHandle: "in",
    type: "smoothstep",
    label: "import",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: { stroke: "#3b82f6", strokeWidth: 3 },
    animated: true,
    markerEnd: {
      type: "arrowclosed",
      color: "#3b82f6",
    },
  },
  {
    id: "web-to-discord",
    source: "web-app",
    sourceHandle: "out",
    target: "discord-package",
    targetHandle: "in",
    type: "smoothstep",
    label: "import",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: { stroke: "#3b82f6", strokeWidth: 3 },
    animated: true,
    markerEnd: {
      type: "arrowclosed",
      color: "#3b82f6",
    },
  },
  {
    id: "web-to-registry",
    source: "web-app",
    sourceHandle: "out",
    target: "registry-package",
    targetHandle: "in",
    type: "smoothstep",
    label: "import",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: { stroke: "#3b82f6", strokeWidth: 3 },
    animated: true,
    markerEnd: {
      type: "arrowclosed",
      color: "#3b82f6",
    },
  },

  // パッケージ間の依存関係
  {
    id: "auth-to-db",
    source: "auth-package",
    sourceHandle: "out",
    target: "db-package",
    targetHandle: "in",
    type: "smoothstep",
    label: "import",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: { stroke: "#10b981", strokeWidth: 2 },
    markerEnd: {
      type: "arrowclosed",
      color: "#10b981",
    },
  },
  {
    id: "registry-to-ui",
    source: "registry-package",
    sourceHandle: "out",
    target: "ui-package",
    targetHandle: "in",
    type: "smoothstep",
    label: "import",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: { stroke: "#10b981", strokeWidth: 2 },
    markerEnd: {
      type: "arrowclosed",
      color: "#10b981",
    },
  },

  // データベーステーブルへの接続
  {
    id: "db-to-feed-items",
    source: "db-package",
    sourceHandle: "out",
    target: "feed-items-table",
    targetHandle: "in",
    type: "smoothstep",
    label: "Drizzle ORM",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: { stroke: "#3b82f6", strokeWidth: 2 },
    markerEnd: {
      type: "arrowclosed",
      color: "#3b82f6",
    },
  },
  {
    id: "db-to-status-events",
    source: "db-package",
    sourceHandle: "out",
    target: "status-events-table",
    targetHandle: "in",
    type: "smoothstep",
    label: "Drizzle ORM",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: { stroke: "#3b82f6", strokeWidth: 2 },
    markerEnd: {
      type: "arrowclosed",
      color: "#3b82f6",
    },
  },

  // データベーステーブルからTursoへの接続
  {
    id: "feed-items-to-turso",
    source: "feed-items-table",
    sourceHandle: "out",
    target: "turso",
    targetHandle: "in",
    type: "smoothstep",
    label: "SQLite",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: { stroke: "#10b981", strokeWidth: 2 },
    animated: true,
    markerEnd: {
      type: "arrowclosed",
      color: "#10b981",
    },
  },
  {
    id: "status-events-to-turso",
    source: "status-events-table",
    sourceHandle: "out",
    target: "turso",
    targetHandle: "in",
    type: "smoothstep",
    label: "SQLite",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: { stroke: "#10b981", strokeWidth: 2 },
    animated: true,
    markerEnd: {
      type: "arrowclosed",
      color: "#10b981",
    },
  },

  // 外部サービスからのデータフロー
  {
    id: "rss-to-feed-items",
    source: "rss-feeds",
    sourceHandle: "out",
    target: "feed-items-table",
    targetHandle: "in",
    type: "smoothstep",
    label: "data",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: { stroke: "#f59e0b", strokeWidth: 2 },
    animated: true,
    markerEnd: {
      type: "arrowclosed",
      color: "#f59e0b",
    },
  },
  {
    id: "discord-to-discord-pkg",
    source: "discord-api",
    sourceHandle: "out",
    target: "discord-package",
    targetHandle: "in",
    type: "smoothstep",
    label: "webhook",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: { stroke: "#f59e0b", strokeWidth: 2 },
    animated: true,
    markerEnd: {
      type: "arrowclosed",
      color: "#f59e0b",
    },
  },
  {
    id: "ai-to-web",
    source: "ai-gateway",
    sourceHandle: "out",
    target: "web-app",
    targetHandle: "in",
    type: "smoothstep",
    label: "AI",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: { stroke: "#f59e0b", strokeWidth: 2 },
    animated: true,
    markerEnd: {
      type: "arrowclosed",
      color: "#f59e0b",
    },
  },

  // BaaSサービスからWeb Appへの接続
  {
    id: "turso-to-web",
    source: "turso",
    sourceHandle: "out",
    target: "web-app",
    targetHandle: "in",
    type: "smoothstep",
    label: "Drizzle Connection",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: { stroke: "#8b5cf6", strokeWidth: 2 },
    animated: true,
    markerEnd: {
      type: "arrowclosed",
      color: "#8b5cf6",
    },
  },
  {
    id: "vercel-to-web",
    source: "vercel",
    sourceHandle: "out",
    target: "web-app",
    targetHandle: "in",
    type: "smoothstep",
    label: "deploy",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: { stroke: "#8b5cf6", strokeWidth: 2 },
    animated: true,
    markerEnd: {
      type: "arrowclosed",
      color: "#8b5cf6",
    },
  },
  {
    id: "stripe-to-web",
    source: "stripe",
    sourceHandle: "out",
    target: "web-app",
    targetHandle: "in",
    type: "smoothstep",
    label: "payment",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: { stroke: "#8b5cf6", strokeWidth: 2 },
    animated: true,
    markerEnd: {
      type: "arrowclosed",
      color: "#8b5cf6",
    },
  },
  {
    id: "resend-to-web",
    source: "resend",
    sourceHandle: "out",
    target: "web-app",
    targetHandle: "in",
    type: "smoothstep",
    label: "email",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: { stroke: "#8b5cf6", strokeWidth: 2 },
    animated: true,
    markerEnd: {
      type: "arrowclosed",
      color: "#8b5cf6",
    },
  },
];
