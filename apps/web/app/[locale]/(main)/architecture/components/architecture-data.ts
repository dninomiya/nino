import { Node, Edge } from "@xyflow/react";

// 共通のエッジスタイル
const commonEdgeStyle = {
  stroke: "var(--primary)",
  strokeWidth: 2,
};

const commonMarkerEnd = {
  type: "arrowclosed" as const,
  color: "var(--primary)",
};

export interface ArchitectureNodeData {
  label: string;
  type: "app" | "package" | "database" | "external" | "baas";
  nodeTypeId: string; // ノードタイプのID（Handle設定のマッチング用）
  description?: string;
  technologies?: string[];
  dependencies?: string[];
  // ノードのサイズ設定（Tailwind CSSクラス）
  size?: string;
  // ハンドルの設定
  handles?: {
    // 上側のハンドル
    topIn?: boolean;
    topOut?: boolean;
    topLeftIn?: boolean;
    topLeftOut?: boolean;
    topCenterIn?: boolean;
    topCenterOut?: boolean;
    topRightIn?: boolean;
    topRightOut?: boolean;

    // 右側のハンドル
    rightIn?: boolean;
    rightOut?: boolean;
    rightTopIn?: boolean;
    rightTopOut?: boolean;
    rightCenterIn?: boolean;
    rightCenterOut?: boolean;
    rightBottomIn?: boolean;
    rightBottomOut?: boolean;

    // 下側のハンドル
    bottomIn?: boolean;
    bottomOut?: boolean;
    bottomLeftIn?: boolean;
    bottomLeftOut?: boolean;
    bottomCenterIn?: boolean;
    bottomCenterOut?: boolean;
    bottomRightIn?: boolean;
    bottomRightOut?: boolean;

    // 左側のハンドル
    leftIn?: boolean;
    leftOut?: boolean;
    leftTopIn?: boolean;
    leftTopOut?: boolean;
    leftCenterIn?: boolean;
    leftCenterOut?: boolean;
    leftBottomIn?: boolean;
    leftBottomOut?: boolean;
  };
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
      size: "w-[220px]",
      handles: {
        leftCenterOut: true,
        rightCenterIn: true,
        rightCenterOut: true,
        topCenterOut: true,
        leftBottomIn: true,
        bottomCenterIn: true,
      },
    },
  },
  {
    id: "sentry",
    type: "custom",
    position: { x: -200, y: 100 }, // Web Appの左側に配置
    data: {
      label: "Sentry",
      type: "baas",
      nodeTypeId: "baas-sentry", // 右側Handle用のタイプID
      description: "エラー監視・パフォーマンス監視",
      technologies: ["Sentry"],
      dependencies: [],
      size: "w-[240px]",
      handles: {
        rightCenterIn: true,
      },
    },
  },

  // パッケージノード
  {
    id: "db-package",
    type: "custom",
    position: { x: 400, y: 100 },
    data: {
      label: "Database Package",
      type: "package",
      nodeTypeId: "package-db",
      description: "ORM・スキーマ管理・マイグレーション",
      technologies: ["Drizzle ORM", "SQLite", "Zod"],
      dependencies: [],
      size: "w-[320px]",
      handles: {
        leftCenterIn: true,
        leftCenterOut: true,
        rightCenterIn: true,
        rightCenterOut: true,
        bottomCenterIn: true,
      },
    },
  },
  {
    id: "auth-package",
    type: "custom",
    position: { x: 400, y: 320 },
    data: {
      label: "Auth Package",
      type: "package",
      nodeTypeId: "package-auth",
      description: "Better Auth 認証システム",
      technologies: ["Better Auth"],
      dependencies: ["@workspace/db"],
      size: "w-[320px]",
      handles: {
        leftCenterIn: true,
        leftCenterOut: true,
        rightTopIn: true,
        rightBottomOut: true,
        topCenterOut: true,
      },
    },
  },
  {
    id: "ui-package",
    type: "custom",
    position: { x: 100, y: 350 },
    data: {
      label: "UI Package",
      type: "package",
      nodeTypeId: "package-ui",
      description: "共有UIコンポーネント",
      technologies: ["Tailwind CSS", "Radix UI"],
      dependencies: [],
      size: "w-[220px]",
      handles: {
        topCenterOut: true,
      },
    },
  },
  {
    id: "lib-package",
    type: "custom",
    position: { x: 400, y: 500 },
    data: {
      label: "Lib Package",
      type: "package",
      nodeTypeId: "package-lib",
      description: "定数、ユーティリティ",
      technologies: [],
      dependencies: [],
      size: "w-[180px]",
      handles: {
        leftCenterIn: true,
        leftCenterOut: true,
      },
    },
  },
  {
    id: "discord-package",
    type: "custom",
    position: { x: -200, y: 250 },
    data: {
      label: "Discord Package",
      type: "package",
      nodeTypeId: "package-discord",
      description: "Discord通知システム",
      technologies: ["Discord.js"],
      dependencies: [],
      size: "w-[240px]",
      handles: {
        rightCenterOut: true,
      },
    },
  },
  {
    id: "registry-package",
    type: "custom",
    position: { x: 400, y: 800 },
    data: {
      label: "Registry Package",
      type: "package",
      nodeTypeId: "package-registry",
      description: "レジストリシステム",
      technologies: ["Next.js"],
      dependencies: ["@workspace/ui"],
      size: "w-[200px]",
      handles: {
        leftCenterIn: true,
        leftCenterOut: true,
      },
    },
  },
  {
    id: "ai-package",
    type: "custom",
    position: { x: 400, y: 950 },
    data: {
      label: "AI Package",
      type: "package",
      nodeTypeId: "package-ai",
      description: "AI機能・プロンプト管理",
      technologies: ["OpenAI", "Vercel AI"],
      dependencies: [],
      size: "w-[250px] h-[120px]",
      handles: {
        topCenterIn: true,
        topCenterOut: true,
        rightCenterIn: true,
        rightCenterOut: true,
      },
    },
  },

  // 外部サービスノード
  {
    id: "ai-gateway",
    type: "custom",
    position: { x: 1140, y: 950 },
    data: {
      label: "Vercel AI Gateway",
      type: "baas",
      nodeTypeId: "external-ai",
      description: "AI Gateway",
      size: "w-[200px]",
      handles: {
        leftCenterIn: true,
        leftCenterOut: true,
      },
    },
  },

  // BaaSサービスノード
  {
    id: "turso",
    type: "custom",
    position: { x: 960, y: 100 }, // Database Packageの隣に移動
    data: {
      label: "Turso",
      type: "baas",
      nodeTypeId: "baas-turso", // 左側Handle用のタイプIDに変更
      description: "データベース",
      dependencies: [],
      size: "w-[200px]",
      handles: {
        leftCenterIn: true,
        leftCenterOut: true,
        topCenterIn: true,
      },
    },
  },
  {
    id: "vercel",
    type: "custom",
    position: { x: 100, y: -160 }, // Web Appの上に移動
    data: {
      label: "Vercel",
      type: "baas",
      nodeTypeId: "baas-vercel", // 下側Handle用のタイプIDに変更
      description: "ホスティング",
      dependencies: [],
      size: "w-[220px]",
      handles: {
        bottomCenterIn: true,
        bottomCenterOut: true,
      },
    },
  },
  {
    id: "github",
    type: "custom",
    position: { x: 100, y: -50 }, // Web Appノードの横幅に揃えて配置
    data: {
      label: "GitHub",
      type: "baas",
      nodeTypeId: "baas-github", // 上下にHandle用のタイプID
      description: "ソースコード管理",
      technologies: ["Git", "GitHub"],
      dependencies: [],
      size: "w-[220px]",
      handles: {
        bottomCenterIn: true,
        bottomCenterOut: true,
        topCenterOut: true,
        rightCenterOut: true,
      },
    },
  },
  {
    id: "stripe",
    type: "custom",
    position: { x: 960, y: 320 }, // Auth Packageの右に移動
    data: {
      label: "Stripe",
      type: "baas",
      nodeTypeId: "baas-stripe", // 左側Handle用のタイプIDに変更
      description: "決済",
      dependencies: [],
      size: "w-[200px] h-[110px]",
      handles: {
        leftTopOut: true,
        leftBottomIn: true,
      },
    },
  },
  {
    id: "resend",
    type: "custom",
    position: { x: 960, y: 500 },
    data: {
      label: "Resend",
      type: "baas",
      nodeTypeId: "baas-email",
      description: "メール送信",
      dependencies: [],
      size: "w-[200px]",
      handles: {
        leftCenterIn: true,
        leftCenterOut: true,
      },
    },
  },
];

export const initialEdges: Edge[] = [
  // 各パッケージからWeb Appへの接続
  {
    id: "db-to-web",
    source: "db-package",
    sourceHandle: "outLeftCenter",
    target: "web-app",
    targetHandle: "inRightCenter",
    type: "smoothstep",
    style: commonEdgeStyle,
    markerEnd: commonMarkerEnd,
  },
  {
    id: "auth-to-web",
    source: "auth-package",
    sourceHandle: "outLeftCenter",
    target: "web-app",
    targetHandle: "inRightCenter",
    type: "smoothstep",
    style: commonEdgeStyle,
    markerEnd: commonMarkerEnd,
  },
  {
    id: "ui-to-web",
    source: "ui-package",
    sourceHandle: "outTopCenter",
    target: "web-app",
    targetHandle: "inBottomCenter",
    type: "smoothstep",
    style: commonEdgeStyle,
    markerEnd: commonMarkerEnd,
  },
  {
    id: "lib-to-web",
    source: "lib-package",
    sourceHandle: "outLeftCenter",
    target: "web-app",
    targetHandle: "inRightCenter",
    type: "smoothstep",
    style: commonEdgeStyle,
    markerEnd: commonMarkerEnd,
  },
  {
    id: "discord-to-web",
    source: "discord-package",
    sourceHandle: "outRightCenter",
    target: "web-app",
    targetHandle: "inLeftBottom",
    type: "smoothstep",
    style: commonEdgeStyle,
  },
  {
    id: "registry-to-web",
    source: "registry-package",
    sourceHandle: "outLeftCenter",
    target: "web-app",
    targetHandle: "inRightCenter",
    type: "smoothstep",
    style: commonEdgeStyle,
    markerEnd: commonMarkerEnd,
  },

  // パッケージ間の依存関係
  {
    id: "auth-to-db",
    source: "auth-package",
    sourceHandle: "outTopCenter",
    target: "db-package",
    targetHandle: "inBottomCenter",
    type: "smoothstep",
    label: "authスキーマ生成",
    style: commonEdgeStyle,
    markerEnd: commonMarkerEnd,
  },
  {
    id: "registry-to-ui",
    source: "registry-package",
    sourceHandle: "outLeftCenter",
    target: "ui-package",
    targetHandle: "inLeftCenter",
    type: "smoothstep",
    style: commonEdgeStyle,
    markerEnd: commonMarkerEnd,
  },

  // 外部サービスからのデータフロー
  {
    id: "ai-package-to-gateway",
    source: "ai-package",
    sourceHandle: "outRightCenter",
    target: "ai-gateway",
    targetHandle: "inLeftCenter",
    type: "smoothstep",
    style: commonEdgeStyle,
    markerEnd: commonMarkerEnd,
  },

  // Web AppからSentryへの接続
  {
    id: "web-to-sentry",
    source: "web-app",
    sourceHandle: "outLeftCenter",
    target: "sentry",
    targetHandle: "inRightCenter",
    type: "smoothstep",
    style: commonEdgeStyle,
    markerEnd: commonMarkerEnd,
  },
  // Web AppからGitHubへの接続
  {
    id: "web-to-github",
    source: "web-app",
    sourceHandle: "outTopCenter",
    target: "github",
    targetHandle: "inBottomCenter",
    type: "smoothstep",
    style: commonEdgeStyle,
    markerEnd: commonMarkerEnd,
  },
  // GitHubからVercelへの接続
  {
    id: "github-to-vercel",
    source: "github",
    sourceHandle: "outTopCenter",
    target: "vercel",
    targetHandle: "inBottomCenter",
    type: "smoothstep",
    style: commonEdgeStyle,
    markerEnd: commonMarkerEnd,
  },
  // GitHubからTursoへの接続
  {
    id: "github-to-turso",
    source: "github",
    sourceHandle: "outRightCenter",
    target: "turso",
    targetHandle: "inTopCenter",
    type: "smoothstep",
    label: "マイグレーション",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: commonEdgeStyle,
    markerEnd: commonMarkerEnd,
  },
  {
    id: "resend-to-web",
    source: "resend",
    sourceHandle: "outLeftCenter",
    target: "web-app",
    targetHandle: "inRightCenter",
    type: "smoothstep",
    label: "email",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: commonEdgeStyle,
    markerEnd: commonMarkerEnd,
  },

  // Database PackageとTursoの双方向接続
  {
    id: "turso-to-db-package",
    source: "turso",
    sourceHandle: "outLeftCenter",
    target: "db-package",
    targetHandle: "inRightCenter",
    type: "smoothstep",
    style: commonEdgeStyle,
    markerEnd: commonMarkerEnd,
  },
  {
    id: "db-package-to-turso",
    source: "db-package",
    sourceHandle: "outRightCenter",
    target: "turso",
    targetHandle: "inLeftCenter",
    type: "smoothstep",
    style: commonEdgeStyle,
    markerEnd: commonMarkerEnd,
  },

  // Auth PackageとStripeの双方向接続
  {
    id: "stripe-to-auth-package",
    source: "stripe",
    sourceHandle: "outLeftTop",
    target: "auth-package",
    targetHandle: "inRightTop",
    type: "smoothstep",
    label: "webhookイベント",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: commonEdgeStyle,
    markerEnd: commonMarkerEnd,
  },
  {
    id: "auth-package-to-stripe",
    source: "auth-package",
    sourceHandle: "outRightBottom",
    target: "stripe",
    targetHandle: "inLeftBottom",
    type: "smoothstep",
    label: "顧客の作成",
    labelStyle: { fontSize: 12, fontWeight: "bold" },
    style: commonEdgeStyle,
    markerEnd: commonMarkerEnd,
  },
];
