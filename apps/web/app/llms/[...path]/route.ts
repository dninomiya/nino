export const dynamic = "force-static";

import { registryDocNames } from "@/lib/registry";
import { NextRequest } from "next/server";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

export async function generateStaticParams() {
  // registry のパス
  const registryDocPaths = registryDocNames.map((name) => ({
    path: ["registry", `${name}.md`],
  }));

  // docs のパス
  const docsDir = join(process.cwd(), "docs");
  const docFiles = await readdir(docsDir);
  const docsDocPaths = docFiles
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => ({
      path: ["docs", file.replace(/\.mdx$/, ".md")],
    }));

  return [...registryDocPaths, ...docsDocPaths];
}

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) => {
  try {
    const { path } = await params;

    // パスを結合
    const pathStr = path.join("/");

    // .md を削除
    const pathWithoutExt = pathStr.replace(/\.md$/, "");

    let filePath: string;

    // docs か registry かを判定
    if (pathWithoutExt.startsWith("docs/")) {
      // docs の場合: docs/{id}.md → docs/{id}.mdx
      const docId = pathWithoutExt.replace(/^docs\//, "");
      filePath = join(process.cwd(), "docs", `${docId}.mdx`);
    } else if (pathWithoutExt.startsWith("registry/")) {
      // registry の場合: registry/{name}.md → app/[locale]/(main)/registry/{name}/doc.mdx
      const registryName = pathWithoutExt.replace(/^registry\//, "");

      // 最後のセグメントが 'doc' かチェック
      const mdxPath = registryName.endsWith("/doc")
        ? `${registryName}.mdx` // registry/codes/doc → registry/codes/doc.mdx
        : `${registryName}/doc.mdx`; // registry/codes → registry/codes/doc.mdx

      filePath = join(
        process.cwd(),
        "app",
        "[locale]",
        "(main)",
        "registry",
        mdxPath
      );
    } else {
      // どちらにも該当しない場合は 404
      return new Response("Not Found", {
        status: 404,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    // ファイルを読み込む
    const content = await readFile(filePath, "utf-8");

    // プレーンテキストとして返却
    return new Response(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch {
    // ファイルが見つからない場合は 404 を返す
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
};
