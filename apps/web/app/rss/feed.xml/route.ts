export const dynamic = "force-static";

import { Feed } from "feed";
import { getDocMetas } from "@/lib/docs";
import { getRegistryDocMetas } from "@/lib/registry";
import { baseUrl } from "@workspace/registry/lib/base-url";
import { APP_NAME } from "@workspace/lib/constants";

export async function GET() {
  const siteUrl = baseUrl();

  const feed = new Feed({
    title: APP_NAME,
    description: "ninoのドキュメントとレジストリ",
    id: siteUrl,
    link: siteUrl,
    language: "ja",
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    feedLinks: {
      rss2: `${siteUrl}/rss/feed.xml`,
    },
  });

  // docs を取得
  const docs = await getDocMetas();
  const registryDocs = await getRegistryDocMetas();

  // すべてのアイテムを結合してソート
  const allItems = [
    ...docs.map((doc) => ({
      title: doc.title,
      description: doc.description,
      link: `${siteUrl}/docs/${doc.id}`,
      date: new Date(doc.updatedAt),
      category: [{ name: "docs" }],
    })),
    ...registryDocs.map((doc) => ({
      title: doc.title,
      description: doc.description,
      link: `${siteUrl}/registry/${doc.name}`,
      date: new Date(doc.updatedAt),
      category: [{ name: "registry" }],
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  // フィードにアイテムを追加
  allItems.forEach((item) => {
    feed.addItem(item);
  });

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
