"use client";

import { useTransition } from "react";
import { Button } from "@workspace/ui/components/button";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { testDiscordNotification } from "@/actions/test-discord-notification";

export function TestDiscordNotificationButton() {
  const [isPending, startTransition] = useTransition();

  const handleTestNotification = () => {
    startTransition(async () => {
      try {
        const result = await testDiscordNotification();

        if (result.success) {
          toast.success(result.message, {
            description: `${result.itemCount}件のアイテムで通知を送信しました`,
          });
        } else {
          toast.error("通知の送信に失敗しました", {
            description: result.message,
          });
        }
      } catch (error) {
        console.error("Discord通知テストエラー:", error);
        toast.error("通知の送信に失敗しました", {
          description: "予期しないエラーが発生しました",
        });
      }
    });
  };

  return (
    <Button
      onClick={handleTestNotification}
      disabled={isPending}
      variant="outline"
      size="sm"
    >
      <MessageSquare className="h-4 w-4 mr-2" />
      {isPending ? "送信中..." : "Discord通知テスト"}
    </Button>
  );
}
