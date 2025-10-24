import { Node, Edge } from "@xyflow/react";

// 共通のエッジスタイル
const commonEdgeStyle = {
  stroke: "var(--primary)",
  strokeWidth: 2,
  strokeOpacity: 0.5,
};

const commonMarkerEnd = {
  type: "arrowclosed" as const,
  color: "var(--border)",
};

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
    position: { x: 100, y: 0 }, // Web Appの上に移動
    data: {
      label: "Vercel",
      type: "baas",
      nodeTypeId: "baas-vercel", // 下側Handle用のタイプIDに変更
      description: "ホスティング",
      dependencies: [],
    },
  },
  {
    id: "stripe",
    type: "custom",
    position: { x: 650, y: 150 }, // Auth Packageの右に移動
    data: {
      label: "Stripe",
      type: "baas",
      nodeTypeId: "baas-stripe", // 左側Handle用のタイプIDに変更
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
    style: commonEdgeStyle,
    animated: true,
    markerEnd: commonMarkerEnd,
  },
  {
    id: "auth-to-web",
    source: "auth-package",
    sourceHandle: "out",
    target: "web-app",
    targetHandle: "in",
    type: "smoothstep",
    style: commonEdgeStyle,
    animated: true,
    markerEnd: commonMarkerEnd,
  },
  {
    id: "ui-to-web",
    source: "ui-package",
    sourceHandle: "out",
    target: "web-app",
    targetHandle: "in",
    type: "smoothstep",
    style: commonEdgeStyle,
    animated: true,
    markerEnd: commonMarkerEnd,
  },
  {
    id: "lib-to-web",
    source: "lib-package",
    sourceHandle: "out",
    target: "web-app",
    targetHandle: "in",
    type: "smoothstep",
    style: commonEdgeStyle,
    animated: true,
    markerEnd: commonMarkerEnd,
  },
  {
    id: "discord-to-web",
    source: "discord-package",
    sourceHandle: "out",
    target: "web-app",
    targetHandle: "in",
    type: "smoothstep",
    style: commonEdgeStyle,
    animated: true,
    markerEnd: commonMarkerEnd,
  },
  {
    id: "registry-to-web",
    source: "registry-package",
    sourceHandle: "out",
    target: "web-app",
    targetHandle: "in",
    type: "smoothstep",
    style: commonEdgeStyle,
    animated: true,
    markerEnd: commonMarkerEnd,
  },

  // パッケージ間の依存関係
  {
    id: "auth-to-db",
    source: "auth-package",
    sourceHandle: "out",
    target: "db-package",
    targetHandle: "in",
    type: "smoothstep",
    style: commonEdgeStyle,
    markerEnd: commonMarkerEnd,
  },
  {
    id: "registry-to-ui",
    source: "registry-package",
    sourceHandle: "out",
    target: "ui-package",
    targetHandle: "in",
    type: "smoothstep",
    style: commonEdgeStyle,
    markerEnd: commonMarkerEnd,
  },

  // 外部サービスからのデータフロー
  {
    id: "discord-to-discord-pkg",
    source: "discord-api",
    sourceHandle: "out",
    target: "discord-package",
    targetHandle: "in",
    type: "smoothstep",
    style: commonEdgeStyle,
    animated: true,
    markerEnd: commonMarkerEnd,
  },
  {
    id: "ai-to-web",
    source: "ai-gateway",
    sourceHandle: "out",
    target: "web-app",
    targetHandle: "in",
    type: "smoothstep",
    style: commonEdgeStyle,
    animated: true,
    markerEnd: commonMarkerEnd,
  },

  // BaaSサービスからWeb Appへの接続
  {
    id: "web-to-vercel",
    source: "web-app",
    sourceHandle: "outTop",
    target: "vercel",
    targetHandle: "in",
    type: "smoothstep",
    style: commonEdgeStyle,
    animated: true,
    markerEnd: commonMarkerEnd,
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
    style: commonEdgeStyle,
    animated: true,
    markerEnd: commonMarkerEnd,
  },

  // Database PackageとTursoの双方向接続
  {
    id: "turso-to-db-package",
    source: "turso",
    sourceHandle: "out",
    target: "db-package",
    targetHandle: "inRight",
    type: "smoothstep",
    style: commonEdgeStyle,
    animated: true,
    markerEnd: commonMarkerEnd,
  },
  {
    id: "db-package-to-turso",
    source: "db-package",
    sourceHandle: "outRight",
    target: "turso",
    targetHandle: "in",
    type: "smoothstep",
    style: commonEdgeStyle,
    animated: true,
    markerEnd: commonMarkerEnd,
  },

  // Auth PackageとStripeの双方向接続
  {
    id: "stripe-to-auth-package",
    source: "stripe",
    sourceHandle: "out",
    target: "auth-package",
    targetHandle: "inRight",
    type: "smoothstep",
    style: commonEdgeStyle,
    animated: true,
    markerEnd: commonMarkerEnd,
  },
  {
    id: "auth-package-to-stripe",
    source: "auth-package",
    sourceHandle: "outRight",
    target: "stripe",
    targetHandle: "in",
    type: "smoothstep",
    style: commonEdgeStyle,
    animated: true,
    markerEnd: commonMarkerEnd,
  },
];
