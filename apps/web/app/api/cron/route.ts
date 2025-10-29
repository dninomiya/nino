import { connection } from "next/server";

import { NextRequest, NextResponse } from "next/server";
import { SCHEDULES } from "./schedule";
import { executeSchedules } from "./helper";

export async function GET(request: NextRequest) {
  await connection();

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
    const jstNow = new Date(Date.now() + 9 * 60 * 60 * 1000); // UTC+9

    console.log(`Checking schedules at JST ${jstNow.toISOString()}`);

    // スケジュールを実行
    const { executed, results } = await executeSchedules(SCHEDULES, jstNow);

    if (executed === 0) {
      return NextResponse.json({
        message: "No matching schedules found",
        currentTime: {
          hour: jstNow.getUTCHours(),
          minute: jstNow.getUTCMinutes(),
          jst: jstNow.toISOString(),
        },
      });
    }

    // 結果をログ出力
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    console.log(
      `Executed ${executed} actions: ${successCount} successful, ${failureCount} failed`
    );

    if (failureCount > 0) {
      const errors = results.filter((r) => !r.success).map((r) => r.error);
      console.error("Failed actions:", errors);
    }

    return NextResponse.json({
      message: `Executed ${executed} actions successfully`,
      executed,
      successCount,
      failureCount,
      timestamp: jstNow.toISOString(),
    });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      {
        error: "Cron execution failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
