"use client";

import { Button } from "@workspace/ui/components/button";
import { Settings } from "lucide-react";
import { useQueryState } from "nuqs";

export function TodoSettingsButton() {
  const [, setOpen] = useQueryState("todo-settings");

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setOpen("true")}
      className="h-9 w-9"
    >
      <Settings className="h-4 w-4" />
      <span className="sr-only">設定を開く</span>
    </Button>
  );
}

