"use client";

import { SiCss, SiTypescript } from "@icons-pack/react-simple-icons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import { File, Folder, FolderOpen } from "lucide-react";
import { ReactNode, useState } from "react";

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

    // 末尾が / で終わる場合はディレクトリとして扱う
    const isDirectoryPath = pathPart.endsWith("/");
    const normalizedPath = isDirectoryPath ? pathPart.slice(0, -1) : pathPart;

    const parts = normalizedPath
      .split("/")
      .filter((p): p is string => Boolean(p));
    let current = root;

    parts.forEach((part, i) => {
      const isLast = i === parts.length - 1;
      // 最後の部分で、かつ元のパスが / で終わっていた場合はディレクトリ
      const isDirectory = isLast ? isDirectoryPath : true;

      if (!current.has(part)) {
        current.set(part, {
          name: part,
          type: isDirectory ? "directory" : "file",
          comment: isLast ? actualComment : undefined,
          children: isDirectory ? new Map() : undefined,
        });
      } else {
        // 既存のノードがある場合、コメントを更新（最後の部分の場合のみ）
        const node = current.get(part)!;
        if (isLast && actualComment) {
          node.comment = actualComment;
        }
        // 既存のノードがファイルだったが、ディレクトリとして指定された場合は更新
        if (isLast && isDirectory && node.type === "file") {
          node.type = "directory";
          node.children = new Map();
        }
      }

      const node = current.get(part)!;
      if (node.children) {
        current = node.children;
      }
    });
  }

  return root;
}

function extractPathsFromChildren(children: ReactNode): string[] {
  // childrenを文字列に変換する関数
  const toString = (node: ReactNode): string => {
    if (typeof node === "string") {
      return node;
    }
    if (typeof node === "number") {
      return String(node);
    }
    if (Array.isArray(node)) {
      return node.map(toString).join("");
    }
    if (node && typeof node === "object" && "props" in node) {
      return toString((node as any).props.children);
    }
    return "";
  };

  const text = toString(children);
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
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

export default function Tree({ children }: { children: ReactNode }) {
  const paths = extractPathsFromChildren(children);
  const tree = buildTree(paths);

  return (
    <figure className="rounded-lg border bg-muted/50 p-4 font-mono">
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
    </figure>
  );
}
