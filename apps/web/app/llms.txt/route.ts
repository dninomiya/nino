export const dynamic = "force-static";

import { readFile } from "fs/promises";
import { join } from "path";
import { gettingStartedItems, registries } from "@/lib/registry";

// get handler
export const GET = async () => {
  try {
    // Getting Started と Registry のアイテムを結合
    const allItems = [
      ...gettingStartedItems,
      ...registries.map((item) => ({
        name: item.name,
        title: item.name,
      })),
    ];

    // 各アイテムから doc.mdx を読み取る
    const contents: string[] = [];
    for (const item of allItems) {
      const docPath = join(
        process.cwd(),
        "app/[locale]/(main)/registry",
        item.name,
        "doc.mdx"
      );
      try {
        const content = await readFile(docPath, "utf-8");
        contents.push(`\n# ${item.name}\n\n${content}\n${"=".repeat(80)}\n`);
      } catch (error) {
        // doc.mdx が存在しない場合はスキップ
        continue;
      }
    }

    // すべてのコンテンツを結合
    const combinedContent = `# Registry Documentation\n${contents.join("\n")}`;

    return new Response(combinedContent, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    return new Response("Error reading registry documentation", {
      status: 500,
    });
  }
};
