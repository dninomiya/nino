import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { fetchAndSaveNewFeedItems } from "@/lib/feed-server";

export async function GET(request: NextRequest) {
  try {
    // 本番環境では認証をチェック
    if (process.env.NODE_ENV === "production") {
      const authHeader = request.headers.get("authorization");
      const cronSecret = process.env.CRON_SECRET;

      if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // 現在時刻を日本時間（JST）に変換
    const now = new Date();
    const jstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC+9
    const hour = jstNow.getUTCHours();
    const minute = jstNow.getUTCMinutes();

    // 日本時間で6, 10, 14, 18時かつ0-1分の範囲内かチェック
    const targetHours = [6, 10, 14, 18];
    const shouldRun = targetHours.includes(hour) && minute <= 1;

    if (!shouldRun) {
      return NextResponse.json({
        message: "Not time to run feed collection",
        currentTime: {
          hour,
          minute,
          jst: jstNow.toISOString(),
        },
      });
    }

    console.log(`Starting feed collection at JST ${jstNow.toISOString()}`);

    // Feed データを収集・保存
    await fetchAndSaveNewFeedItems(7);

    // ページを revalidate
    revalidatePath("/");
    revalidatePath("/ja");
    revalidatePath("/en");

    console.log(`Feed collection completed.`);

    return NextResponse.json({
      message: "Feed collection completed successfully",
      timestamp: jstNow.toISOString(),
    });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      {
        error: "Feed collection failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
