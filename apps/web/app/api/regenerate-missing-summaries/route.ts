import { NextRequest, NextResponse } from "next/server";
import { regenerateMissingSummariesInBatch } from "@/lib/feed-server";

export async function POST(request: NextRequest) {
  try {
    // バッチで欠損した要約を再生成
    const result = await regenerateMissingSummariesInBatch();

    if (result.totalCount === 0) {
      return NextResponse.json({
        success: true,
        message: "要約が欠損しているアイテムはありません",
        regeneratedCount: 0,
      });
    }

    if (result.errors.length > 0) {
      console.warn("Some summaries failed to regenerate:", result.errors);
    }

    return NextResponse.json({
      success: true,
      message: `${result.successCount}件の要約を生成しました`,
      regeneratedCount: result.successCount,
      totalItems: result.totalCount,
      errors: result.errors.length > 0 ? result.errors : undefined,
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
