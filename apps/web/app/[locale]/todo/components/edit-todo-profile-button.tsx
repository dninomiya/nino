"use client";

import { Button } from "@/components/ui/button";
import { useQueryState } from "nuqs";

export function EditTodoProfileButton({ create }: { create?: boolean }) {
  const [_, setEditTodoProfile] = useQueryState("edit-todo-profile");

  return (
    <Button
      onClick={() => setEditTodoProfile("true")}
      variant="outline"
      className="w-full"
      size="sm"
    >
      {create ? "プロフィールを作成する" : "プロフィールを編集する"}
    </Button>
  );
}
