import { Node, Edge } from "@xyflow/react";

export interface ArchitectureNodeData {
  label: string;
  type: "app" | "package" | "database" | "external" | "baas";
  nodeTypeId: string; // ノードタイプのID（Handle設定のマッチング用）
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
      nodeTypeId: "app-main",
      description: "Next.js 16 メインアプリケーション",
      technologies: ["Next.js 16"],
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
      nodeTypeId: "package-db",
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
      nodeTypeId: "package-auth",
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
      nodeTypeId: "package-ui",
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
      nodeTypeId: "package-lib",
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
      nodeTypeId: "package-discord",
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
      nodeTypeId: "package-registry",
      description: "レジストリシステム",
      technologies: ["Next.js"],
      dependencies: ["@workspace/ui"],
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
      nodeTypeId: "external-rss",
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
      nodeTypeId: "external-discord",
      description: "Discord Webhook API",
      technologies: ["Discord API", "Webhooks"],
      dependencies: [],
    },
  },
  {
    id: "ai-gateway",
    type: "custom",
    position: { x: 1000, y: 300 },
    data: {
      label: "AI Gateway",
      type: "baas",
      nodeTypeId: "external-ai",
      description: "AI Gateway",
    },
  },

  // BaaSサービスノード
  {
    id: "turso",
    type: "custom",
    position: { x: 650, y: 50 }, // Database Packageの隣に移動
    data: {
      label: "Turso",
      type: "baas",
      nodeTypeId: "baas-turso", // 左側Handle用のタイプIDに変更
      description: "データベース",
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
      nodeTypeId: "baas-hosting",
      description: "ホスティング",
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
      nodeTypeId: "baas-payment",
      description: "決済",
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
      nodeTypeId: "baas-email",
      description: "メール送信",
      dependencies: [],
    },
  },
];

export const initialEdges: Edge[] = [
  // 各パッケージからWeb Appへの接続
  {
    id: "db-to-web",
    source: "db-package",
    sourceHandle: "out",
    target: "web-app",
    targetHandle: "in",
    type: "smoothstep",
    style: { stroke: "#3b82f6", strokeWidth: 3 },
    animated: true,
    markerEnd: {
      type: "arrowclosed",
      color: "#3b82f6",
    },
  },
  {
    id: "auth-to-web",
    source: "auth-package",
    sourceHandle: "out",
    target: "web-app",
    targetHandle: "in",
    type: "smoothstep",
    style: { stroke: "#3b82f6", strokeWidth: 3 },
    animated: true,
    markerEnd: {
      type: "arrowclosed",
      color: "#3b82f6",
    },
  },
  {
    id: "ui-to-web",
    source: "ui-package",
    sourceHandle: "out",
    target: "web-app",
    targetHandle: "in",
    type: "smoothstep",
    style: { stroke: "#3b82f6", strokeWidth: 3 },
    animated: true,
    markerEnd: {
      type: "arrowclosed",
      color: "#3b82f6",
    },
  },
  {
    id: "lib-to-web",
    source: "lib-package",
    sourceHandle: "out",
    target: "web-app",
    targetHandle: "in",
    type: "smoothstep",
    style: { stroke: "#3b82f6", strokeWidth: 3 },
    animated: true,
    markerEnd: {
      type: "arrowclosed",
      color: "#3b82f6",
    },
  },
  {
    id: "discord-to-web",
    source: "discord-package",
    sourceHandle: "out",
    target: "web-app",
    targetHandle: "in",
    type: "smoothstep",
    style: { stroke: "#3b82f6", strokeWidth: 3 },
    animated: true,
    markerEnd: {
      type: "arrowclosed",
      color: "#3b82f6",
    },
  },
  {
    id: "registry-to-web",
    source: "registry-package",
    sourceHandle: "out",
    target: "web-app",
    targetHandle: "in",
    type: "smoothstep",
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
    style: { stroke: "#10b981", strokeWidth: 2 },
    markerEnd: {
      type: "arrowclosed",
      color: "#10b981",
    },
  },

  // 外部サービスからのデータフロー
  {
    id: "discord-to-discord-pkg",
    source: "discord-api",
    sourceHandle: "out",
    target: "discord-package",
    targetHandle: "in",
    type: "smoothstep",
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
    style: { stroke: "#8b5cf6", strokeWidth: 2 },
    animated: true,
    markerEnd: {
      type: "arrowclosed",
      color: "#8b5cf6",
    },
  },
  {
    id: "web-to-vercel",
    source: "web-app",
    sourceHandle: "out",
    target: "vercel",
    targetHandle: "in",
    type: "smoothstep",
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

  // Database PackageとTursoの双方向接続
  {
    id: "turso-to-db-package",
    source: "turso",
    sourceHandle: "out",
    target: "db-package",
    targetHandle: "inRight",
    type: "smoothstep",
    style: { stroke: "#10b981", strokeWidth: 2 },
    animated: true,
    markerEnd: {
      type: "arrowclosed",
      color: "#10b981",
    },
  },
  {
    id: "db-package-to-turso",
    source: "db-package",
    sourceHandle: "outRight",
    target: "turso",
    targetHandle: "in",
    type: "smoothstep",
    style: { stroke: "#10b981", strokeWidth: 2 },
    animated: true,
    markerEnd: {
      type: "arrowclosed",
      color: "#10b981",
    },
  },
];
