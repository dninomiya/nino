"use client";

import { useTransition } from "react";
import { Button } from "@workspace/ui/components/button";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { testDiscordNotification } from "@/actions/test-discord-notification";
import { useTranslations } from "next-intl";

export function TestDiscordNotificationButton() {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("TestDiscordNotificationButton");

  const handleTestNotification = () => {
    startTransition(async () => {
      try {
        const result = await testDiscordNotification();

        if (result.success) {
          toast.success(result.message, {
            description: t("success", { count: result.itemCount }),
          });
        } else {
          toast.error(t("error"), {
            description: result.message,
          });
        }
      } catch (error) {
        console.error("Discord通知テストエラー:", error);
        toast.error(t("error"), {
          description: t("unexpectedError"),
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
      {isPending ? t("sending") : t("button")}
    </Button>
  );
}
