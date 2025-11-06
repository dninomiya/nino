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
} from "@/components/ui/form";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { updateProfile } from "@/actions/profile";
import { Profile } from "@workspace/db";
import { profileFormSchema, ProfileFormSchema } from "@workspace/db/zod";
import { ArrowUp, ArrowDown, Plus, Trash2 } from "lucide-react";

interface ProfileEditDialogProps {
  profile?: Profile | null;
}

export function ProfileEditDialog({ profile }: ProfileEditDialogProps) {
  const [editTodoProfile, setEditTodoProfile] =
    useQueryState("edit-todo-profile");

  // linksをJSONから配列に変換
  const linksArray: string[] =
    profile?.links && profile.links !== null
      ? (JSON.parse(profile.links) as string[])
      : [];

  const defaultValues: ProfileFormSchema = {
    nickname: profile?.nickname ?? "",
    avatar: profile?.avatar ?? "",
    tagline: profile?.tagline ?? "",
    bio: profile?.bio ?? "",
    links: linksArray,
  };

  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileFormSchema as any),
    defaultValues,
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    // @ts-expect-error - React Hook Form type inference issue
    name: "links",
  });

  async function onSubmit(data: ProfileFormSchema) {
    const result = await updateProfile(data);
    if (result?.success) {
      setEditTodoProfile(null);
    } else {
      // エラーハンドリング（必要に応じてトーストなどを表示）
      console.error("プロフィールの保存に失敗しました:", result?.error);
    }
  }

  return (
    <Dialog
      open={editTodoProfile === "true"}
      onOpenChange={(status) => setEditTodoProfile(status ? "true" : null)}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {profile ? "プロフィールを編集する" : "プロフィールを作成する"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ニックネーム</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      spellCheck={false}
                      placeholder="ニックネーム"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>アバター</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/avatar.png"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>一言メッセージ</FormLabel>
                  <FormControl>
                    <Input placeholder="一言メッセージ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>自己紹介</FormLabel>
                  <FormControl>
                    <Textarea placeholder="自己紹介" rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>リンク</FormLabel>
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`links.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="https://example.com"
                              type="url"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (index > 0) {
                            move(index, index - 1);
                          }
                        }}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (index < fields.length - 1) {
                            move(index, index + 1);
                          }
                        }}
                        disabled={index === fields.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append("")}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  リンクを追加
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditTodoProfile(null)}
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
