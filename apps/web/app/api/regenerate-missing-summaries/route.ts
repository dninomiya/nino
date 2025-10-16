import { NextRequest, NextResponse } from "next/server";
import {
  getItemsWithMissingSummary,
  regenerateSummaryForItem,
} from "@/lib/feed-server";

export async function POST(request: NextRequest) {
  try {
    // summaryが空のアイテムを取得（YouTube除外）
    const itemsWithMissingSummary = await getItemsWithMissingSummary();

    if (itemsWithMissingSummary.length === 0) {
      return NextResponse.json({
        success: true,
        message: "要約が欠損しているアイテムはありません",
        regeneratedCount: 0,
      });
    }

    let regeneratedCount = 0;
    const errors: string[] = [];

    // 各アイテムの要約を順次生成
    for (const item of itemsWithMissingSummary) {
      try {
        await regenerateSummaryForItem(item.url, item.date);
        regeneratedCount++;
      } catch (error) {
        console.error(`Failed to regenerate summary for ${item.url}:`, error);
        errors.push(
          `${item.title}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    if (errors.length > 0) {
      console.warn("Some summaries failed to regenerate:", errors);
    }

    return NextResponse.json({
      success: true,
      message: `${regeneratedCount}件の要約を生成しました`,
      regeneratedCount,
      totalItems: itemsWithMissingSummary.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Failed to regenerate missing summaries:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to regenerate missing summaries",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
