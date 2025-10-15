import { NextRequest, NextResponse } from "next/server";
import { db } from "@workspace/db";
import { feedItems } from "@workspace/db/schemas/feed";
import { eq, and } from "drizzle-orm";
import { generateObject } from "ai";
import { z } from "zod";

const summarySchema = z.object({
  title: z.string(),
  summary: z.string(),
  tags: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { url, date } = await request.json();

    if (!url || !date) {
      return NextResponse.json(
        { error: "URL and date are required" },
        { status: 400 }
      );
    }

    // DB からフィードアイテムを取得
    const [item] = await db
      .select()
      .from(feedItems)
      .where(and(eq(feedItems.url, url), eq(feedItems.date, new Date(date))))
      .limit(1);

    if (!item) {
      return NextResponse.json(
        { error: "Feed item not found" },
        { status: 404 }
      );
    }

    // AI による要約生成
    const availableTags = [
      "feature: 新機能の追加や機能拡張",
      "event: イベント、カンファレンス、ワークショップ",
      "bugfix: バグ修正、不具合対応",
      "big-news: 大きなニュース、重要な発表",
      "release: 新バージョンリリース",
      "update: アップデート、改善",
      "announcement: お知らせ、告知",
      "tutorial: チュートリアル、ガイド",
      "documentation: ドキュメント更新",
      "security: セキュリティ関連",
      "performance: パフォーマンス改善",
      "breaking-change: 破壊的変更",
    ].join("\n");

    // rawXml からコンテンツを抽出
    let content = "";
    try {
      const rawData = JSON.parse(item.rawXml || "{}");
      content = rawData.contentSnippet || rawData.description || "";
    } catch {
      content = "";
    }

    const contentPreview = content.substring(0, 1000);
    const prompt =
      "以下の技術記事のタイトルと内容を分析して、以下の3つを生成してください：\n\n" +
      "1. より分かりやすい日本語のタイトル（元のタイトルを改善）\n" +
      "2. 記事の要約（2-3文で簡潔に日本語で）\n" +
      "3. 適切なタグ（1-3個選択）\n\n" +
      "元のタイトル: " +
      item.title +
      "\n" +
      "内容: " +
      contentPreview +
      "...\n\n" +
      "利用可能なタグ:\n" +
      availableTags +
      "\n\n" +
      "注意事項：\n" +
      "- タイトルは日本語で、技術的な内容を分かりやすく表現してください\n" +
      "- 要約は日本語で、記事の要点を簡潔にまとめてください\n" +
      "- タグは記事の内容に最も適したものを選択してください";

    const result = await generateObject({
      model: "google/gemini-2.5-flash-lite",
      prompt,
      schema: summarySchema,
    });

    // DB を更新
    await db
      .update(feedItems)
      .set({
        title: result.object.title || item.title,
        summary: result.object.summary || "",
        tags: result.object.tags
          ? JSON.stringify(result.object.tags)
          : item.tags,
      })
      .where(and(eq(feedItems.url, url), eq(feedItems.date, new Date(date))));

    return NextResponse.json({
      success: true,
      data: {
        title: result.object.title || item.title,
        summary: result.object.summary || "",
        tags: result.object.tags || [],
      },
    });
  } catch (error) {
    console.error("Failed to regenerate summary:", error);
    return NextResponse.json(
      {
        error: "Failed to regenerate summary",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
