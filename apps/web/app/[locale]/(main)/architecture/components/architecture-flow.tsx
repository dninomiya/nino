"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@workspace/ui/components/button";
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

interface ArchitectureFlowProps {
  className?: string;
}

function ArchitectureFlowInner({ className }: ArchitectureFlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as any);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onLayout = useCallback(() => {
    // 自動レイアウト機能（簡易版）
    const layoutedNodes = nodes.map((node, index) => ({
      ...node,
      position: {
        x: (index % 3) * 300 + 100,
        y: Math.floor(index / 3) * 200 + 100,
      },
    }));
    setNodes(layoutedNodes);
  }, [nodes, setNodes]);

  const selectedNode = useMemo(() => {
    return nodes.find((node) => node.selected);
  }, [nodes]);

  return (
    <div className={`h-[600px] w-full relative ${className}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        className="bg-gray-50 dark:bg-gray-900"
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Background />
        <Controls />

        {/* コントロールパネル - React Flow内に配置 */}
        <div className="absolute top-4 right-4 z-10">
          <div className="flex flex-col gap-2">
            <Button onClick={onLayout} size="sm" variant="outline">
              📐 レイアウト整列
            </Button>
            <Button
              onClick={() => window.location.reload()}
              size="sm"
              variant="outline"
            >
              🔄 リセット
            </Button>
          </div>
        </div>

        {/* 凡例 - React Flow内に配置 */}
        <div className="absolute top-4 left-4 z-10">
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">凡例</CardTitle>
            </CardHeader>
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
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span>外部サービス</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 選択されたノードの詳細情報 - React Flow内に配置 */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 z-10 max-w-sm">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <span>CustomNode</span>
                  {
                    (selectedNode.data as unknown as ArchitectureNodeData)
                      ?.label
                  }
                </CardTitle>
                <CardDescription>
                  {
                    (selectedNode.data as unknown as ArchitectureNodeData)
                      ?.description
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <h4 className="text-xs font-medium mb-1">技術スタック:</h4>
                    <div className="flex flex-wrap gap-1">
                      {(
                        selectedNode.data as unknown as ArchitectureNodeData
                      )?.technologies?.map((tech: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {(selectedNode.data as unknown as ArchitectureNodeData)
                    ?.dependencies &&
                    (selectedNode.data as unknown as ArchitectureNodeData)
                      .dependencies!.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium mb-1">依存関係:</h4>
                        <div className="flex flex-wrap gap-1">
                          {(
                            selectedNode.data as unknown as ArchitectureNodeData
                          ).dependencies!.map((dep: string, index: number) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
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
