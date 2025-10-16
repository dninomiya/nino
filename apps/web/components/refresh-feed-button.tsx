"use client";

import { Button } from "@/components/ui/button";
import { fetchFeedItems } from "@/actions";
import { Download, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function RefreshFeedButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      toast.info("最新データを取得中...");

      await fetchFeedItems();

      toast.success("最新データを取得しました");
      // ページをリフレッシュして新しいデータを表示
      router.refresh();
    } catch (error) {
      console.error("Failed to refresh feed:", error);
      toast.error("データの取得に失敗しました");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button
      onClick={handleRefresh}
      disabled={isRefreshing}
      variant="outline"
      className="flex items-center gap-2"
    >
      <RefreshCcw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
      {isRefreshing ? "取得中..." : "最新データに更新"}
    </Button>
  );
}
