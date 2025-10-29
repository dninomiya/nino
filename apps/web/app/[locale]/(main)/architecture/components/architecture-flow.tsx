"use client";

import React from "react";
import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowProvider,
  NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import {
  initialNodes,
  initialEdges,
  ArchitectureNodeData,
} from "./architecture-data";
import { nodeTypes } from "./node-types";
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
import { useTheme } from "next-themes";

interface ArchitectureFlowProps {
  className?: string;
}

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

function ArchitectureFlowInner({ className }: ArchitectureFlowProps) {
  const { resolvedTheme } = useTheme();

  return (
    <div className={`h-[600px] w-full relative ${className}`}>
      <ReactFlow
        nodes={initialNodes as any}
        edges={initialEdges as any}
        nodeTypes={nodeTypes}
        fitView
        colorMode={resolvedTheme === "light" ? "light" : "dark"}
        fitViewOptions={{ padding: 0.2 }}
        className="bg-gray-50 dark:bg-gray-900"
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        nodesFocusable={false}
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={null}
        multiSelectionKeyCode={null}
      >
        <Background />
        <Controls />

        {/* 凡例 - React Flow内に配置 */}
        <div className="absolute top-4 left-4 z-10">
          <Card>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>アプリケーション</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>パッケージ</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span>データベース</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-cyan-500 rounded"></div>
                <span>BaaS</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </ReactFlow>
    </div>
  );
}

export function ArchitectureFlow(props: ArchitectureFlowProps) {
  return (
    <ReactFlowProvider>
      <ArchitectureFlowInner {...props} />
    </ReactFlowProvider>
  );
}
