"use client";

import { Button } from "@/components/ui/button";
import { getItemsWithMissingSummary } from "@/lib/feed-server";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface RegenerateMissingSummariesButtonProps {
  missingCount: number;
}

export function RegenerateMissingSummariesButton({
  missingCount,
}: RegenerateMissingSummariesButtonProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const router = useRouter();
  const t = useTranslations("RegenerateMissingSummariesButton");

  const handleRegenerateMissing = async () => {
    if (missingCount === 0) {
      toast.info(t("noMissing"));
      return;
    }

    try {
      setIsRegenerating(true);
      toast.info(t("generating", { count: missingCount }));

      const response = await fetch("/api/regenerate-missing-summaries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(t("error"));
      }

      const result = await response.json();

      if (result.success) {
        toast.success(t("success", { count: result.regeneratedCount }));
        // ページをリフレッシュして新しいデータを表示
        router.refresh();
      } else {
        throw new Error(result.error || t("error"));
      }
    } catch (error) {
      console.error("Failed to regenerate missing summaries:", error);
      toast.error(t("error"));
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
      {isRegenerating
        ? t("generatingButton")
        : t("button", { count: missingCount })}
    </Button>
  );
}
