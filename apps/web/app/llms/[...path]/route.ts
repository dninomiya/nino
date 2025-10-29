import { registryDocNames } from "@/lib/registry";
import { NextRequest } from "next/server";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

export async function generateStaticParams() {
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

/**
 * パスからファイルパスを構築する
 */
function buildFilePath(path: string[]): string | null {
  // パスを結合
  const pathStr = path.join("/");

  // .md を削除
  const pathWithoutExt = pathStr.replace(/\.md$/, "");

  // docs か registry かを判定
  if (pathWithoutExt.startsWith("docs/")) {
    // docs の場合: docs/{id}.md → docs/{id}.mdx
    const docId = pathWithoutExt.replace(/^docs\//, "");
    return join(process.cwd(), "docs", `${docId}.mdx`);
  } else if (pathWithoutExt.startsWith("registry/")) {
    // registry の場合: registry/{name}.md → app/[locale]/(main)/registry/{name}/doc.mdx
    const registryName = pathWithoutExt.replace(/^registry\//, "");

    // 最後のセグメントが 'doc' かチェック
    const mdxPath = registryName.endsWith("/doc")
      ? `${registryName}.mdx` // registry/codes/doc → registry/codes/doc.mdx
      : `${registryName}/doc.mdx`; // registry/codes → registry/codes/doc.mdx

    return join(
      process.cwd(),
      "app",
      "[locale]",
      "(main)",
      "registry",
      mdxPath
    );
  }

  return null;
}

/**
 * ファイルからコンテンツを読み込む
 */
async function readContent(filePath: string): Promise<string> {
  return await readFile(filePath, "utf-8");
}

/**
 * パスからコンテンツを生成する
 */
async function generateContent(path: string[]): Promise<string | undefined> {
  // ファイルパスを構築
  const filePath = buildFilePath(path);
  if (!filePath) {
    return undefined;
  }

  // ファイルからコンテンツを読み込む
  return readContent(filePath);
}

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) => {
  const { path } = await params;
  const content = await generateContent(path);

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
