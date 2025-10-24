"use client";

import { memo } from "react";
import { Handle, Position, NodeProps, NodeTypes } from "@xyflow/react";
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
} from "@icons-pack/react-simple-icons";

const nodeTypeColors = {
  app: "bg-blue-500 border-blue-600 text-white",
  package: "bg-green-500 border-green-600 text-white",
  database: "bg-purple-500 border-purple-600 text-white",
  external: "bg-orange-500 border-orange-600 text-white",
  baas: "bg-cyan-500 border-cyan-600 text-white",
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
  };

  return iconMap[tech] || null;
};

export const CustomNode = memo(({ data, selected }: NodeProps) => {
  const { label, type, description, technologies } =
    data as unknown as ArchitectureNodeData;
  const colorClass = nodeTypeColors[type as keyof typeof nodeTypeColors];
  const icon = nodeTypeIcons[type as keyof typeof nodeTypeIcons];

  return (
    <div className={`min-w-[200px] ${selected ? "ring-2 ring-blue-400" : ""}`}>
      <Card className={`${colorClass} border-2`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <span>{icon}</span>
            {label}
          </CardTitle>
          {description && (
            <CardDescription className="text-xs opacity-90">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          {technologies && technologies.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {technologies.map((tech: string, index: number) => {
                const IconComponent = getTechnologyIcon(tech);
                return (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs flex items-center gap-1"
                  >
                    {IconComponent && (
                      <IconComponent size={12} className="text-current" />
                    )}
                    {tech}
                  </Badge>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-400"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-400"
      />
    </div>
  );
});

CustomNode.displayName = "CustomNode";

export const nodeTypes: NodeTypes = {
  custom: CustomNode,
};
