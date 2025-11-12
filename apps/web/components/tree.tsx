"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  FolderOpen,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import { SiCss, SiTypescript } from "@icons-pack/react-simple-icons";

const icons = {
  file: File,
  directory: Folder,
  ts: SiTypescript,
  tsx: SiTypescript,
  css: SiCss,
} as const;

function getFileIcon(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (extension && extension in icons) {
    return icons[extension as keyof typeof icons];
  }
  return icons.file;
}

const mockPaths = [
  "/app/page.tsx # comment",
  "/app/api/auth/[...nextauth]/route.ts",
  "/app/api/legal/route.ts",
  "/app/api/search/route.ts",
  "/app/api/users/route.ts",
  "/app/api/users/[id]/route.ts",
  "/app/api/users/[id]/route.ts",
];

type TreeNode = {
  name: string;
  type: "file" | "directory";
  comment?: string;
  children?: Map<string, TreeNode>;
};

function buildTree(paths: string[]): Map<string, TreeNode> {
  const root = new Map<string, TreeNode>();

  for (const path of paths) {
    // コメント部分を分離
    const partsWithComment = path.split(/#/, 2);
    const pathPart = partsWithComment[0]?.trim() || "";
    const comment = partsWithComment[1]?.trim();
    const actualComment = comment || undefined;

    const parts = pathPart.split("/").filter((p): p is string => Boolean(p));
    let current = root;

    parts.forEach((part, i) => {
      const isLast = i === parts.length - 1;

      if (!current.has(part)) {
        current.set(part, {
          name: part,
          type: isLast ? "file" : "directory",
          comment: isLast ? actualComment : undefined,
          children: isLast ? undefined : new Map(),
        });
      } else {
        // 既存のノードがある場合、コメントを更新（ファイルの場合のみ）
        const node = current.get(part)!;
        if (isLast && actualComment) {
          node.comment = actualComment;
        }
      }

      const node = current.get(part)!;
      if (!isLast && node.children) {
        current = node.children;
      }
    });
  }

  return root;
}

function TreeNodeComponent({ node }: { node: TreeNode }) {
  const isDirectory = node.type === "directory";
  const hasChildren = node.children && node.children.size > 0;
  const [isOpen, setIsOpen] = useState(true);

  const sortedChildren = hasChildren
    ? Array.from(node.children!.values()).sort((a, b) => {
        // ディレクトリを先に、その後ファイルをソート
        if (a.type !== b.type) {
          return a.type === "directory" ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      })
    : [];

  if (isDirectory && hasChildren) {
    return (
      <Collapsible defaultOpen={true} onOpenChange={setIsOpen}>
        <div className="select-none">
          <CollapsibleTrigger className="flex items-center gap-2 py-1 text-sm w-full hover:bg-muted/50 rounded-sm transition-colors">
            {isOpen ? (
              <FolderOpen className="size-4 text-muted-foreground" />
            ) : (
              <Folder className="size-4 text-muted-foreground" />
            )}
            <span className="text-foreground">{node.name}</span>
            {node.comment && (
              <span className="text-muted-foreground"># {node.comment}</span>
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="pl-6">
              {sortedChildren.map((child) => (
                <TreeNodeComponent key={child.name} node={child} />
              ))}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  }

  return (
    <div className="select-none">
      <div className="flex items-center gap-2 py-1 text-sm">
        {isDirectory ? (
          <Folder className="size-4 text-muted-foreground" />
        ) : (
          (() => {
            const IconComponent = getFileIcon(node.name);
            return (
              <IconComponent
                color="default"
                className="size-4 text-muted-foreground"
              />
            );
          })()
        )}
        <span className="text-foreground">{node.name}</span>
        {node.comment && (
          <span className="text-muted-foreground"># {node.comment}</span>
        )}
      </div>
      {sortedChildren.length > 0 && (
        <div className="pl-5">
          {sortedChildren.map((child) => (
            <TreeNodeComponent key={child.name} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Tree({ paths = mockPaths }: { paths: string[] }) {
  const tree = buildTree(paths);

  return (
    <div className="rounded-lg border bg-muted/50 p-4 font-mono">
      {Array.from(tree.values())
        .sort((a, b) => {
          // ディレクトリを先に、その後ファイルをソート
          if (a.type !== b.type) {
            return a.type === "directory" ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        })
        .map((node) => (
          <TreeNodeComponent key={node.name} node={node} />
        ))}
    </div>
  );
}
