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
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@workspace/ui/components/label";
import { updateTodoSettings } from "@/actions/todo-settings";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useState } from "react";

const todoSettingsFormSchema = z.object({
  soundEnabled: z.boolean(),
});

type TodoSettingsFormSchema = z.infer<typeof todoSettingsFormSchema>;

interface TodoSettingsButtonProps {
  initialSettings: {
    soundEnabled: boolean;
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
    },
  });

  async function onSubmit(data: TodoSettingsFormSchema) {
    const result = await updateTodoSettings({
      soundEnabled: data.soundEnabled,
    });

    if (result?.success) {
      setOpen(false);
      router.refresh();
    } else {
      console.error("設定の保存に失敗しました:", result?.error);
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
          <DialogTitle>設定</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="soundEnabled"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start gap-3">
                    <FormControl>
                      <Checkbox
                        id="sound-enabled"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="grid gap-2">
                      <Label htmlFor="sound-enabled">効果音</Label>
                      <p className="text-muted-foreground text-sm">
                        タスク完了時に効果音を再生します
                      </p>
                    </div>
                  </div>
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
