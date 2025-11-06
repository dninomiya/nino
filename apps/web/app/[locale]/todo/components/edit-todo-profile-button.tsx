"use client";

import { Button } from "@/components/ui/button";
import { useQueryState } from "nuqs";

export function EditTodoProfileButton() {
  const [_, setEditTodoProfile] = useQueryState("edit-todo-profile");

  return (
    <Button
      onClick={() => setEditTodoProfile("true")}
      variant="outline"
      className="w-full"
      size="sm"
    >
      プロフィールを編集する
    </Button>
  );
}
