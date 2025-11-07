"use client";

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
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskFormSchema, TaskFormSchema } from "@workspace/db/zod";
import { ArrowUp } from "lucide-react";
import { useTransition } from "react";

export function TaskForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<TaskFormSchema>({
    resolver: zodResolver(taskFormSchema as any),
    defaultValues: {
      title: "",
      sp: "1",
    },
  });

  async function onSubmit(data: TaskFormSchema) {
    startTransition(async () => {
      await addTask(data);
      form.reset();
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center gap-1 p-1 bg-card/30 rounded-lg border border-black/10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  autoFocus
                  type="text"
                  placeholder="やること..."
                  spellCheck={false}
                  autoComplete="off"
                  className="bg-transparent border-none shadow-none h-8"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sp"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-transparent border-none shadow-none text-muted-foreground h-8!">
                    <SelectValue placeholder="SP" />
                  </SelectTrigger>
                </FormControl>
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
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="icon"
          className="bg-black/60 size-8"
          disabled={isPending}
        >
          <ArrowUp />
          <span className="sr-only">タスクを追加</span>
        </Button>
      </form>
    </Form>
  );
}
