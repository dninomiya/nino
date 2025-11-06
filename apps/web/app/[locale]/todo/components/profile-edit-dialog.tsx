"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQueryState } from "nuqs";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export function ProfileEditDialog() {
  const [editTodoProfile, setEditTodoProfile] =
    useQueryState("edit-todo-profile");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  return (
    <Dialog
      open={editTodoProfile === "true"}
      onOpenChange={(status) => setEditTodoProfile(status ? "true" : null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>プロフィールを編集する</DialogTitle>
        </DialogHeader>

        <Form>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ユーザー名</FormLabel>
              </FormItem>
            )}
          />
        </Form>
      </DialogContent>
    </Dialog>
  );
}
