import { addTask } from "@/actions/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export function TaskForm() {
  return (
    <form action={addTask} className="flex items-center gap-2">
      <Input
        type="text"
        placeholder="細かい単位のタスク..."
        spellCheck={false}
        autoComplete="off"
      />
      <Button type="submit" size="icon">
        <Plus />
        <span className="sr-only">タスクを追加</span>
      </Button>
    </form>
  );
}
