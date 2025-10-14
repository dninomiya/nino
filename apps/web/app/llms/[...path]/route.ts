export const dynamic = "force-static";

import { registryDocNames } from "@/lib/registry";
import { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function generateStaticParams() {
  const registryDocPaths = registryDocNames.map((name) => ({
    path: `/llms/registry/${name}`,
  }));
  console.log(registryDocPaths);
  return [...registryDocPaths];
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

    // 最後のセグメントが 'doc' かチェック
    const mdxPath = pathWithoutExt.endsWith("/doc")
      ? `${pathWithoutExt}.mdx` // registry/codes/doc → registry/codes/doc.mdx
      : `${pathWithoutExt}/doc.mdx`; // registry/codes → registry/codes/doc.mdx

    // app/[locale]/(main)/ 配下のファイルパスを構築
    // ロケールに依存しないように、直接 (main) 配下を参照
    const filePath = join(process.cwd(), "app", "[locale]", "(main)", mdxPath);

    // ファイルを読み込む
    const content = await readFile(filePath, "utf-8");

    // プレーンテキストとして返却
    return new Response(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    // ファイルが見つからない場合は 404 を返す
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
};
