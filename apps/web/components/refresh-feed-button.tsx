"use client";

import { Button } from "@/components/ui/button";
import { fetchFeedItems } from "@/actions/feed";
import { Download, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function RefreshFeedButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const t = useTranslations("RefreshFeedButton");

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      toast.info(t("fetching"));

      await fetchFeedItems();

      toast.success(t("success"));
      // ページをリフレッシュして新しいデータを表示
      router.refresh();
    } catch (error) {
      console.error("Failed to refresh feed:", error);
      toast.error(t("error"));
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
      {isRefreshing ? t("fetchingButton") : t("refreshButton")}
    </Button>
  );
}
