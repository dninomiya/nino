import { addTask } from "@/actions/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUp } from "lucide-react";

export function TaskForm() {
  return (
    <form
      action={addTask}
      className="flex items-center gap-1 p-1 bg-card/30 rounded-lg border border-black/10"
    >
      <Input
        autoFocus
        type="text"
        name="title"
        placeholder="やること..."
        spellCheck={false}
        autoComplete="off"
        className="bg-transparent border-none shadow-none h-8"
        required
      />

      <Select name="sp" defaultValue="1">
        <SelectTrigger className="bg-transparent border-none shadow-none text-muted-foreground h-8!">
          <SelectValue placeholder="SP" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1</SelectItem>
          <SelectItem value="2">2</SelectItem>
          <SelectItem value="3">3</SelectItem>
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="8">8</SelectItem>
          <SelectItem value="13">13</SelectItem>
          <SelectItem value="21">21</SelectItem>
        </SelectContent>
      </Select>

      <Button type="submit" size="icon" className="bg-black/60 size-8">
        <ArrowUp />
        <span className="sr-only">タスクを追加</span>
      </Button>
    </form>
  );
}
