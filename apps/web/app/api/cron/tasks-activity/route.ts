import { connection } from "next/server";
import { NextRequest, NextResponse } from "next/server";
import { getYesterdayCompletedTasks } from "@/data/task";
import { db, profiles } from "@workspace/db";
import { and, eq, inArray } from "drizzle-orm";
import { sendDiscordWebhook } from "@workspace/discord";
import { baseUrl } from "@/registry/lib/base-url";
import { verifyCronAuth } from "@/lib/cron";

export async function GET(request: NextRequest) {
  await connection();

  try {
    // 認証をチェック
    const authError = verifyCronAuth(request);
    if (authError) return authError;

    // 1. 昨日完了したタスクを全取得（全ユーザー分）
    const yesterdayTasks = await getYesterdayCompletedTasks();

    if (yesterdayTasks.length === 0) {
      return NextResponse.json({
        message: "No completed tasks yesterday",
        timestamp: new Date().toISOString(),
      });
    }

    // 2. ユニークなuserIdリストを作成
    const uniqueUserIds = Array.from(
      new Set(yesterdayTasks.map((task) => task.userId))
    );

    // 3. 公開設定のプロフィールをフィルタして取得
    const publicProfiles = await db.query.profiles.findMany({
      where: and(
        inArray(profiles.userId, uniqueUserIds),
        eq(profiles.tasksPublic, true)
      ),
    });

    if (publicProfiles.length === 0) {
      return NextResponse.json({
        message: "No public profiles with completed tasks yesterday",
        timestamp: new Date().toISOString(),
      });
    }

    // プロフィールごとにタスクをグループ化
    const tasksByUserId = new Map<string, typeof yesterdayTasks>();
    for (const task of yesterdayTasks) {
      if (!tasksByUserId.has(task.userId)) {
        tasksByUserId.set(task.userId, []);
      }
      tasksByUserId.get(task.userId)!.push(task);
    }

    // 4. メッセージ生成（RSSフィード形式を参考）
    const sections = publicProfiles
      .map((profile) => {
        const tasks = tasksByUserId.get(profile.userId) || [];
        if (tasks.length === 0) return null;

        // タスク一覧を作成
        const taskList = tasks.map((task) => `- ${task.title}`).join("\n");

        // プロフィール名
        const profileName = profile.nickname || "匿名ユーザー";

        // サマリー（タスク数）
        const summary = `${tasks.length}件のタスク完了`;

        return {
          title: profileName,
          summary: summary,
          taskList: taskList,
        };
      })
      .filter((section) => section !== null);

    if (sections.length === 0) {
      return NextResponse.json({
        message: "No sections to send",
        timestamp: new Date().toISOString(),
      });
    }

    // メッセージをフォーマット
    const now = new Date();
    const jstString = new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo",
      dateStyle: "medium",
      timeStyle: "short",
    }).format(now);

    const header = `📋 ${jstString} 昨日完了したタスク\n\n`;

    const formattedSections = sections
      .map((section) => {
        if (!section) return "";
        return `**${section.title}**: ${section.summary}\n${section.taskList}`;
      })
      .join("\n\n");

    const footer = `\n\n一緒にタスク管理しましょう☕️\n<${baseUrl()}/todo>`;

    const message = header + formattedSections + footer;

    // 5. Discord webhookに送信
    const isDev = process.env.NODE_ENV === "development";
    await sendDiscordWebhook(isDev ? "admin" : "activity", message);

    return NextResponse.json({
      message: "Task activity notification sent successfully",
      profilesCount: publicProfiles.length,
      tasksCount: yesterdayTasks.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Task activity cron job failed:", error);
    return NextResponse.json(
      {
        error: "Task activity cron execution failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
