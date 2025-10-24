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
  const { label, type, nodeTypeId, description, technologies, size, handles } =
    data as unknown as ArchitectureNodeData;
  const colorClass = nodeTypeColors[type as keyof typeof nodeTypeColors];
  const icon = nodeTypeIcons[type as keyof typeof nodeTypeIcons];

  // グループ内のノードかどうかを判定
  const isInGroup = data.parentId;

  // サイズ設定を取得（データで指定されたサイズを優先、なければデフォルト）
  const getNodeSize = () => {
    return size || "w-[200px]";
  };

  // ハンドル設定を取得
  const getHandleConfig = () => {
    if (!handles) {
      return {
        in: { position: Position.Left, top: "66%", left: undefined },
        out: { position: Position.Left, top: "33%", left: undefined },
      };
    }

    const config: Record<string, any> = {};

    // 上側のハンドル
    if (handles.topLeftIn) {
      config.inTopLeft = {
        position: Position.Top,
        top: undefined,
        left: "25%",
      };
    }
    if (handles.topLeftOut) {
      config.outTopLeft = {
        position: Position.Top,
        top: undefined,
        left: "25%",
      };
    }
    if (handles.topCenterIn) {
      config.inTopCenter = {
        position: Position.Top,
        top: undefined,
        left: "50%",
      };
    }
    if (handles.topCenterOut) {
      config.outTopCenter = {
        position: Position.Top,
        top: undefined,
        left: "50%",
      };
    }
    if (handles.topRightIn) {
      config.inTopRight = {
        position: Position.Top,
        top: undefined,
        left: "75%",
      };
    }
    if (handles.topRightOut) {
      config.outTopRight = {
        position: Position.Top,
        top: undefined,
        left: "75%",
      };
    }
    // 後方互換性のため
    if (handles.topIn && !handles.topCenterIn) {
      config.inTop = { position: Position.Top, top: undefined, left: "50%" };
    }
    if (handles.topOut && !handles.topCenterOut) {
      config.outTop = { position: Position.Top, top: undefined, left: "50%" };
    }

    // 右側のハンドル
    if (handles.rightTopIn) {
      config.inRightTop = {
        position: Position.Right,
        top: "25%",
        left: undefined,
      };
    }
    if (handles.rightTopOut) {
      config.outRightTop = {
        position: Position.Right,
        top: "25%",
        left: undefined,
      };
    }
    if (handles.rightCenterIn) {
      config.inRightCenter = {
        position: Position.Right,
        top: "50%",
        left: undefined,
      };
    }
    if (handles.rightCenterOut) {
      config.outRightCenter = {
        position: Position.Right,
        top: "50%",
        left: undefined,
      };
    }
    if (handles.rightBottomIn) {
      config.inRightBottom = {
        position: Position.Right,
        top: "75%",
        left: undefined,
      };
    }
    if (handles.rightBottomOut) {
      config.outRightBottom = {
        position: Position.Right,
        top: "75%",
        left: undefined,
      };
    }
    // 後方互換性のため
    if (handles.rightIn && !handles.rightCenterIn) {
      config.inRight = {
        position: Position.Right,
        top: "66%",
        left: undefined,
      };
    }
    if (handles.rightOut && !handles.rightCenterOut) {
      config.outRight = {
        position: Position.Right,
        top: "33%",
        left: undefined,
      };
    }

    // 下側のハンドル
    if (handles.bottomLeftIn) {
      config.inBottomLeft = {
        position: Position.Bottom,
        top: undefined,
        left: "25%",
      };
    }
    if (handles.bottomLeftOut) {
      config.outBottomLeft = {
        position: Position.Bottom,
        top: undefined,
        left: "25%",
      };
    }
    if (handles.bottomCenterIn) {
      config.inBottomCenter = {
        position: Position.Bottom,
        top: undefined,
        left: "50%",
      };
    }
    if (handles.bottomCenterOut) {
      config.outBottomCenter = {
        position: Position.Bottom,
        top: undefined,
        left: "50%",
      };
    }
    if (handles.bottomRightIn) {
      config.inBottomRight = {
        position: Position.Bottom,
        top: undefined,
        left: "75%",
      };
    }
    if (handles.bottomRightOut) {
      config.outBottomRight = {
        position: Position.Bottom,
        top: undefined,
        left: "75%",
      };
    }
    // 後方互換性のため
    if (handles.bottomIn && !handles.bottomCenterIn) {
      config.inBottom = {
        position: Position.Bottom,
        top: undefined,
        left: "50%",
      };
    }
    if (handles.bottomOut && !handles.bottomCenterOut) {
      config.outBottom = {
        position: Position.Bottom,
        top: undefined,
        left: "50%",
      };
    }

    // 左側のハンドル
    if (handles.leftTopIn) {
      config.inLeftTop = {
        position: Position.Left,
        top: "25%",
        left: undefined,
      };
    }
    if (handles.leftTopOut) {
      config.outLeftTop = {
        position: Position.Left,
        top: "25%",
        left: undefined,
      };
    }
    if (handles.leftCenterIn) {
      config.inLeftCenter = {
        position: Position.Left,
        top: "50%",
        left: undefined,
      };
    }
    if (handles.leftCenterOut) {
      config.outLeftCenter = {
        position: Position.Left,
        top: "50%",
        left: undefined,
      };
    }
    if (handles.leftBottomIn) {
      config.inLeftBottom = {
        position: Position.Left,
        top: "75%",
        left: undefined,
      };
    }
    if (handles.leftBottomOut) {
      config.outLeftBottom = {
        position: Position.Left,
        top: "75%",
        left: undefined,
      };
    }
    // 後方互換性のため
    if (handles.leftIn && !handles.leftCenterIn) {
      config.in = { position: Position.Left, top: "66%", left: undefined };
    }
    if (handles.leftOut && !handles.leftCenterOut) {
      config.out = { position: Position.Left, top: "33%", left: undefined };
    }

    return config;
  };

  const finalHandleConfig = getHandleConfig();

  return (
    <Card className={cn(getNodeSize(), "text-sm p-3", colorClass)}>
      {/* 動的にハンドルをレンダリング */}
      {Object.entries(finalHandleConfig).map(([key, config]) => {
        if (!config) return null;

        const isTarget = key.startsWith("in");
        const isSource = key.startsWith("out");

        return (
          <Handle
            key={key}
            type={isTarget ? "target" : "source"}
            id={key}
            position={config.position}
            style={{
              background: "var(--muted)",
              ...(config.top ? { top: config.top } : {}),
              ...(config.left ? { left: config.left } : {}),
            }}
          />
        );
      })}

      <CardHeader className="p-0">
        <CardTitle>{label}</CardTitle>
        {description && (
          <CardDescription
            className={`${isInGroup ? "text-[10px]" : "text-xs"} overflow-hidden`}
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
