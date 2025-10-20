"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface RegenerateMissingSummariesButtonProps {
  missingCount: number;
}

export function RegenerateMissingSummariesButton({
  missingCount,
}: RegenerateMissingSummariesButtonProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const router = useRouter();

  const handleRegenerateMissing = async () => {
    if (missingCount === 0) {
      toast.info("要約が欠損しているアイテムはありません");
      return;
    }

    try {
      setIsRegenerating(true);
      toast.info(`${missingCount}件の要約を生成開始します...`);

      const response = await fetch("/api/regenerate-missing-summaries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("要約の再生成に失敗しました");
      }

      const result = await response.json();

      if (result.success) {
        toast.success(`${result.regeneratedCount}件の要約を生成しました`);
        // ページをリフレッシュして新しいデータを表示
        router.refresh();
      } else {
        throw new Error(result.error || "要約の再生成に失敗しました");
      }
    } catch (error) {
      console.error("Failed to regenerate missing summaries:", error);
      toast.error("要約の再生成に失敗しました");
    } finally {
      setIsRegenerating(false);
    }
  };

  if (missingCount === 0) {
    return null;
  }

  return (
    <Button
      onClick={handleRegenerateMissing}
      disabled={isRegenerating}
      variant="outline"
      className="flex items-center gap-2"
    >
      <RefreshCw className={`size-4 ${isRegenerating ? "animate-spin" : ""}`} />
      {isRegenerating ? "生成中..." : `要約の欠損を解決 (${missingCount}件)`}
    </Button>
  );
}
