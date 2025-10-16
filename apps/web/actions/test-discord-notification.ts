"use server";

import { getFeedItemsFromDB, sendDiscordNotification } from "@/lib/feed-server";
import { revalidatePath } from "next/cache";

export async function testDiscordNotification() {
  try {
    // 最新5件のDBアイテムを取得
    const feedItems = await getFeedItemsFromDB(30); // 30日分から最新5件を取得
    const latestItems = feedItems.slice(0, 5);

    if (latestItems.length === 0) {
      return {
        success: false,
        message: "通知対象のアイテムがありません",
      };
    }

    // Discord通知を送信
    await sendDiscordNotification(latestItems);

    // ページを再検証
    revalidatePath("/");

    return {
      success: true,
      message: `Discord通知を送信しました（${latestItems.length}件のアイテム）`,
      itemCount: latestItems.length,
      items: latestItems.map((item, index) => ({
        id: `${item.source}-${index}`,
        title: item.title,
        source: item.source,
        url: item.url,
      })),
    };
  } catch (error) {
    console.error("Discord通知テストでエラーが発生しました:", error);

    return {
      success: false,
      message: "Discord通知の送信に失敗しました",
      error: error instanceof Error ? error.message : "不明なエラー",
    };
  }
}
