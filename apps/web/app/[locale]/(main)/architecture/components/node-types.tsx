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

const nodeTypeColors = {
  app: "bg-blue-500 border-blue-600 text-white",
  package: "bg-green-500 border-green-600 text-white",
  database: "bg-purple-500 border-purple-600 text-white",
  external: "bg-orange-500 border-orange-600 text-white",
};

const nodeTypeIcons = {
  app: "🌐",
  package: "📦",
  database: "🗄️",
  external: "🔗",
};

export const CustomNode = memo(
  ({ data, selected }: NodeProps<ArchitectureNodeData>) => {
    const { label, type, description, technologies } = data;
    const colorClass = nodeTypeColors[type];
    const icon = nodeTypeIcons[type];

    return (
      <div
        className={`min-w-[200px] ${selected ? "ring-2 ring-blue-400" : ""}`}
      >
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
                {technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
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
  }
);

CustomNode.displayName = "CustomNode";

export const nodeTypes: NodeTypes = {
  custom: CustomNode,
};
