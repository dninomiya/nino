"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Settings } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { updateTodoSettings } from "@/actions/todo-settings";
import { updateProfileTasksPublic } from "@/actions/profile";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useState } from "react";

const todoSettingsFormSchema = z.object({
  soundEnabled: z.boolean(),
  tasksPublic: z.boolean(),
});

type TodoSettingsFormSchema = z.infer<typeof todoSettingsFormSchema>;

interface TodoSettingsButtonProps {
  initialSettings: {
    soundEnabled: boolean;
    tasksPublic: boolean;
  };
}

export function TodoSettingsButton({
  initialSettings,
}: TodoSettingsButtonProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<TodoSettingsFormSchema>({
    resolver: zodResolver(todoSettingsFormSchema),
    defaultValues: {
      soundEnabled: initialSettings.soundEnabled,
      tasksPublic: initialSettings.tasksPublic,
    },
  });

  async function onSubmit(data: TodoSettingsFormSchema) {
    const [soundResult, tasksPublicResult] = await Promise.all([
      updateTodoSettings({ soundEnabled: data.soundEnabled }),
      updateProfileTasksPublic(data.tasksPublic),
    ]);

    if (soundResult?.success && tasksPublicResult?.success) {
      setOpen(false);
      router.refresh();
    } else {
      console.error("設定の保存に失敗しました:", soundResult?.error || tasksPublicResult?.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-transparent">
          <Settings className="size-5 text-foreground/60" />
          <span className="sr-only">設定を開く</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>タスク設定</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="soundEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">効果音</FormLabel>
                    <FormDescription>
                      タスク完了時に効果音を再生します
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tasksPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      マイタスクの公開
                    </FormLabel>
                    <FormDescription>
                      マイタスクを他のユーザーに公開します
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                キャンセル
              </Button>
              <Button type="submit">保存</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
