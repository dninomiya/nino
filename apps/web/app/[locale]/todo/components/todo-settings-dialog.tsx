"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQueryState } from "nuqs";
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
import { Button } from "@workspace/ui/components/button";
import { Switch } from "@/components/ui/switch";
import { updateTodoSettings } from "@/actions/todo-settings";
import { useRouter } from "next/navigation";
import { z } from "zod";

const todoSettingsFormSchema = z.object({
  soundEnabled: z.boolean(),
  tasksPublic: z.boolean(),
});

type TodoSettingsFormSchema = z.infer<typeof todoSettingsFormSchema>;

interface TodoSettingsDialogProps {
  initialSettings: {
    soundEnabled: boolean;
    tasksPublic: boolean;
  };
}

export function TodoSettingsDialog({
  initialSettings,
}: TodoSettingsDialogProps) {
  const [open, setOpen] = useQueryState("todo-settings");
  const router = useRouter();

  const form = useForm<TodoSettingsFormSchema>({
    resolver: zodResolver(todoSettingsFormSchema),
    defaultValues: {
      soundEnabled: initialSettings.soundEnabled,
      tasksPublic: initialSettings.tasksPublic,
    },
  });

  async function onSubmit(data: TodoSettingsFormSchema) {
    const result = await updateTodoSettings(data);
    if (result?.success) {
      setOpen(null);
      router.refresh();
    } else {
      console.error("設定の保存に失敗しました:", result?.error);
    }
  }

  return (
    <Dialog
      open={open === "true"}
      onOpenChange={(status) => setOpen(status ? "true" : null)}
    >
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
                onClick={() => setOpen(null)}
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
