"use client";

import { memo } from "react";
import { NodeProps, NodeTypes, Handle, Position } from "@xyflow/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { ArchitectureNodeData } from "./architecture-data";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiDrizzle,
  SiSqlite,
  SiZod,
  SiBetterauth,
  SiRadixui,
  SiDiscord,
  SiOpenai,
  SiTurso,
  SiVercel,
  SiStripe,
  SiResend,
  SiGit,
  SiGithub,
  SiSentry,
} from "@icons-pack/react-simple-icons";
import { cn } from "@/lib/utils";

const nodeTypeColors = {
  app: "border-blue-600 text-white",
  package: "border-green-600 text-white",
  database: "border-purple-600 text-white",
  external: "border-orange-600 text-white",
  baas: "border-cyan-600 text-white",
};

const nodeTypeIcons = {
  app: "🌐",
  package: "📦",
  database: "🗄️",
  external: "🔗",
  baas: "☁️",
};

// ノードタイプID別のHandle配置設定
const nodeTypeHandleConfig: Record<
  string,
  {
    in: { position: Position; top?: string; left?: string };
    out?: { position: Position; top?: string; left?: string };
    inRight?: { position: Position; top?: string; left?: string };
    outRight?: { position: Position; top?: string; left?: string };
    inTop?: { position: Position; top?: string; left?: string };
    outTop?: { position: Position; top?: string; left?: string };
    outLeft?: { position: Position; top?: string; left?: string };
  }
> = {
  // アプリケーションタイプ（左右にHandle）
  "app-main": {
    in: { position: Position.Right, top: "66%", left: undefined },
    out: { position: Position.Right, top: "33%", left: undefined },
    // 左側のHandleも追加（Sentryとの接続用）
    outLeft: { position: Position.Left, top: "50%", left: undefined },
    // 上側のHandleも追加（Vercelとの接続用）
    inTop: { position: Position.Top, top: undefined, left: "50%" },
    outTop: { position: Position.Top, top: undefined, left: "50%" },
  },
  "app-sidebar": {
    in: { position: Position.Left, top: "66%", left: undefined },
    out: { position: Position.Right, top: "33%", left: undefined },
  },

  // パッケージタイプ（左右にHandle）
  "package-db": {
    in: { position: Position.Left, top: "66%", left: undefined },
    out: { position: Position.Left, top: "33%", left: undefined },
    // 右側のHandleも追加（Tursoとの接続用）
    inRight: { position: Position.Right, top: "66%", left: undefined },
    outRight: { position: Position.Right, top: "33%", left: undefined },
  },
  "package-auth": {
    in: { position: Position.Left, top: "66%", left: undefined },
    out: { position: Position.Left, top: "33%", left: undefined },
    // 右側のHandleも追加（Stripeとの接続用）
    inRight: { position: Position.Right, top: "66%", left: undefined },
    outRight: { position: Position.Right, top: "33%", left: undefined },
  },
  "package-ui": {
    in: { position: Position.Left, top: "66%", left: undefined },
    out: { position: Position.Left, top: "33%", left: undefined },
  },
  "package-lib": {
    in: { position: Position.Left, top: "66%", left: undefined },
    out: { position: Position.Left, top: "33%", left: undefined },
  },
  "package-discord": {
    in: { position: Position.Left, top: "66%", left: undefined },
    out: { position: Position.Left, top: "33%", left: undefined },
  },
  "package-registry": {
    in: { position: Position.Left, top: "66%", left: undefined },
    out: { position: Position.Left, top: "33%", left: undefined },
  },
  "package-ai": {
    in: { position: Position.Left, top: "66%", left: undefined },
    out: { position: Position.Left, top: "33%", left: undefined },
  },

  // データベースタイプ（左右にHandle）
  "database-main": {
    in: { position: Position.Left, top: "66%", left: undefined },
    out: { position: Position.Left, top: "33%", left: undefined },
  },

  // 外部サービスタイプ（左右にHandle）
  "external-rss": {
    in: { position: Position.Left, top: "66%", left: undefined },
    out: { position: Position.Left, top: "33%", left: undefined },
  },
  "external-discord": {
    in: { position: Position.Left, top: "66%", left: undefined },
    out: { position: Position.Left, top: "33%", left: undefined },
  },
  "external-ai": {
    in: { position: Position.Left, top: "66%", left: undefined },
    out: { position: Position.Left, top: "33%", left: undefined },
  },

  // BaaSサービスタイプ（上下にHandle）
  "baas-database": {
    in: { position: Position.Bottom, top: undefined, left: "66%" },
    out: { position: Position.Bottom, top: undefined, left: "33%" },
  },
  // Turso専用（左側にHandle）
  "baas-turso": {
    in: { position: Position.Left, top: "66%", left: undefined },
    out: { position: Position.Left, top: "33%", left: undefined },
  },
  "baas-hosting": {
    in: { position: Position.Bottom, top: undefined, left: "66%" },
    out: { position: Position.Bottom, top: undefined, left: "33%" },
  },
  // Vercel専用（下側にHandle）
  "baas-vercel": {
    in: { position: Position.Bottom, top: undefined, left: "50%" },
    out: { position: Position.Bottom, top: undefined, left: "50%" },
  },
  // GitHub専用（上下にHandle）
  "external-github": {
    in: { position: Position.Bottom, top: undefined, left: "50%" },
    out: { position: Position.Bottom, top: undefined, left: "33%" },
    outTop: { position: Position.Top, top: undefined, left: "50%" },
  },
  // Sentry専用（右側にinのみ）
  "baas-sentry": {
    in: { position: Position.Right, top: "50%", left: undefined },
  },
  "baas-payment": {
    in: { position: Position.Bottom, top: undefined, left: "66%" },
    out: { position: Position.Bottom, top: undefined, left: "33%" },
  },
  "baas-email": {
    in: { position: Position.Bottom, top: undefined, left: "66%" },
    out: { position: Position.Bottom, top: undefined, left: "33%" },
  },
  // Stripe専用（左側にHandle）
  "baas-stripe": {
    in: { position: Position.Left, top: "66%", left: undefined },
    out: { position: Position.Left, top: "33%", left: undefined },
  },
};

// 技術名とアイコンのマッピング
const getTechnologyIcon = (tech: string) => {
  const iconMap: Record<
    string,
    React.ComponentType<{ className?: string; size?: number }>
  > = {
    "Next.js 16": SiNextdotjs,
    "Next.js": SiNextdotjs,
    "React 19": SiReact,
    React: SiReact,
    TypeScript: SiTypescript,
    "Tailwind CSS": SiTailwindcss,
    "Drizzle ORM": SiDrizzle,
    SQLite: SiSqlite,
    Zod: SiZod,
    "Better Auth": SiBetterauth,
    "Radix UI": SiRadixui,
    "Discord.js": SiDiscord,
    "Discord API": SiDiscord,
    OpenAI: SiOpenai,
    Turso: SiTurso,
    Vercel: SiVercel,
    Stripe: SiStripe,
    Resend: SiResend,
    Git: SiGit,
    GitHub: SiGithub,
    Sentry: SiSentry,
  };

  return iconMap[tech] || null;
};

export const CustomNode = memo(({ data, selected }: NodeProps) => {
  const { label, type, nodeTypeId, description, technologies } =
    data as unknown as ArchitectureNodeData;
  const colorClass = nodeTypeColors[type as keyof typeof nodeTypeColors];
  const icon = nodeTypeIcons[type as keyof typeof nodeTypeIcons];

  // グループ内のノードかどうかを判定
  const isInGroup = data.parentId;

  // ノードタイプIDに応じたHandle設定を取得
  const handleConfig = nodeTypeHandleConfig[nodeTypeId] || {
    in: { position: Position.Left, top: "66%", left: undefined },
    out: { position: Position.Left, top: "33%", left: undefined },
  };

  // ノードタイプID別のサイズ設定
  const nodeTypeSizes: Record<string, string> = {
    // アプリケーション
    "app-main": "w-[200px]",
    "app-sidebar": "w-[180px]",

    // パッケージ
    "package-db": "w-[220px]",
    "package-auth": "w-[200px]",
    "package-ui": "w-[200px]",
    "package-lib": "w-[180px]",
    "package-discord": "w-[200px]",
    "package-registry": "w-[200px]",
    "package-ai": "w-[200px]",

    // データベース
    "database-main": "w-[200px]",

    // 外部サービス
    "external-rss": "w-[180px]",
    "external-discord": "w-[200px]",
    "external-ai": "w-[200px]",
    "external-github": "w-[200px]",

    // BaaSサービス
    "baas-database": "w-[300px] h-[80px]",
    "baas-turso": "w-[200px]",
    "baas-hosting": "w-[300px] h-[80px]",
    "baas-vercel": "w-[200px]",
    "baas-payment": "w-[200px]",
    "baas-email": "w-[200px]",
    "baas-stripe": "w-[200px]",
    "baas-sentry": "w-[200px]",
  };

  // ノードタイプIDに応じたサイズ設定を取得
  const getNodeSize = (nodeTypeId: string) => {
    return nodeTypeSizes[nodeTypeId] || "w-[200px]"; // デフォルトサイズ
  };

  return (
    <Card className={cn(getNodeSize(nodeTypeId), "text-sm p-3", colorClass)}>
      {/* Handle for incoming connections */}
      <Handle
        type="target"
        id="in"
        position={handleConfig.in.position}
        style={{
          background: "var(--muted)",
          ...(handleConfig.in.top ? { top: handleConfig.in.top } : {}),
          ...(handleConfig.in.left ? { left: handleConfig.in.left } : {}),
        }}
      />

      {/* Handle for outgoing connections */}
      {handleConfig.out && (
        <Handle
          type="source"
          id="out"
          position={handleConfig.out.position}
          style={{
            background: "var(--muted)",
            ...(handleConfig.out.top ? { top: handleConfig.out.top } : {}),
            ...(handleConfig.out.left ? { left: handleConfig.out.left } : {}),
          }}
        />
      )}

      {/* 右側のHandle（Database Package用） */}
      {handleConfig.inRight && (
        <Handle
          type="target"
          id="inRight"
          position={handleConfig.inRight.position}
          style={{
            background: "var(--muted)",
            ...(handleConfig.inRight.top
              ? { top: handleConfig.inRight.top }
              : {}),
            ...(handleConfig.inRight.left
              ? { left: handleConfig.inRight.left }
              : {}),
          }}
        />
      )}

      {handleConfig.outRight && (
        <Handle
          type="source"
          id="outRight"
          position={handleConfig.outRight.position}
          style={{
            background: "var(--muted)",
            ...(handleConfig.outRight.top
              ? { top: handleConfig.outRight.top }
              : {}),
            ...(handleConfig.outRight.left
              ? { left: handleConfig.outRight.left }
              : {}),
          }}
        />
      )}

      {/* 上側のHandle（Web App用） */}
      {handleConfig.inTop && (
        <Handle
          type="target"
          id="inTop"
          position={handleConfig.inTop.position}
          style={{
            background: "var(--muted)",
            ...(handleConfig.inTop.top ? { top: handleConfig.inTop.top } : {}),
            ...(handleConfig.inTop.left
              ? { left: handleConfig.inTop.left }
              : {}),
          }}
        />
      )}

      {handleConfig.outTop && (
        <Handle
          type="source"
          id="outTop"
          position={handleConfig.outTop.position}
          style={{
            background: "var(--muted)",
            ...(handleConfig.outTop.top
              ? { top: handleConfig.outTop.top }
              : {}),
            ...(handleConfig.outTop.left
              ? { left: handleConfig.outTop.left }
              : {}),
          }}
        />
      )}

      {/* 左側のHandle（Web App用） */}
      {handleConfig.outLeft && (
        <Handle
          type="source"
          id="outLeft"
          position={handleConfig.outLeft.position}
          style={{
            background: "var(--muted)",
            ...(handleConfig.outLeft.top
              ? { top: handleConfig.outLeft.top }
              : {}),
            ...(handleConfig.outLeft.left
              ? { left: handleConfig.outLeft.left }
              : {}),
          }}
        />
      )}

      <CardHeader className="p-0">
        <CardTitle>{label}</CardTitle>
        {description && (
          <CardDescription
            className={`${isInGroup ? "text-[10px]" : "text-xs"} opacity-90 overflow-hidden`}
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {description}
          </CardDescription>
        )}
      </CardHeader>
      {technologies && technologies.length > 0 && (
        <CardContent className="p-0">
          <div className="flex flex-wrap gap-1">
            {technologies.map((tech: string, index: number) => {
              const IconComponent = getTechnologyIcon(tech);
              return (
                <Badge
                  key={index}
                  variant="secondary"
                  className={`${isInGroup ? "text-[10px] px-1 py-0" : "text-xs"} flex items-center gap-1`}
                >
                  {IconComponent && (
                    <IconComponent
                      size={isInGroup ? 10 : 12}
                      className="text-current"
                    />
                  )}
                  {tech}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
});

CustomNode.displayName = "CustomNode";

// グループノードコンポーネント
export const GroupNode = memo(({ data, selected }: NodeProps) => {
  const { label, description } = data as unknown as ArchitectureNodeData;

  return (
    <div className={`w-full h-full ${selected ? "ring-2 ring-blue-400" : ""}`}>
      <Card className="w-full h-full bg-purple-500/10 border-2 border-purple-500/30 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <span>🗄️</span>
            {label}
          </CardTitle>
          {description && (
            <CardDescription className="text-xs text-purple-600 dark:text-purple-400">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      </Card>
    </div>
  );
});

GroupNode.displayName = "GroupNode";

export const nodeTypes: NodeTypes = {
  custom: CustomNode,
  group: GroupNode,
};
