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
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@workspace/ui/components/label";
import { updateProfile } from "@/actions/profile";
import { Profile } from "@workspace/db";
import { profileFormSchema, ProfileFormSchema } from "@workspace/db/zod";
import { ArrowUp, ArrowDown, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  ImageCropper,
  ImageCropperFileSelector,
  ImageCropperPreview,
} from "@/registry/components/image-cropper";

interface ProfileEditDialogProps {
  profile?: Profile | null;
}

export function ProfileEditDialog({ profile }: ProfileEditDialogProps) {
  const [editTodoProfile, setEditTodoProfile] =
    useQueryState("edit-todo-profile");
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
    tasksPublic: profile?.tasksPublic ?? true,
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
                  <FormLabel>プロフィール画像</FormLabel>
                  <FormControl>
                    <ImageCropperFileSelector
                      onFileSelect={(file) => {
                        setSelectedFile(file);
                        setCropDialogOpen(true);
                      }}
                      className="w-40 aspect-square"
                    >
                      {field.value && (
                        <ImageCropperPreview
                          src={field.value}
                          onRemove={() => field.onChange("")}
                        />
                      )}
                    </ImageCropperFileSelector>
                  </FormControl>
                  <FormDescription>
                    プロフィールに表示される画像をアップロードしてください。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>いま何してる？</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="ポートフォリオ作成中..."
                      {...field}
                    />
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

            <FormField
              control={form.control}
              name="tasksPublic"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50 dark:has-aria-checked:border-blue-900 dark:has-aria-checked:bg-blue-950 cursor-pointer">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                      />
                      <div className="grid gap-1.5 font-normal">
                        <p className="text-sm leading-none font-medium">
                          タスクを公開する
                        </p>
                        <p className="text-muted-foreground text-sm">
                          チェックを入れると、他のユーザーがあなたのタスクリストを閲覧できるようになります。
                        </p>
                      </div>
                    </Label>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

        {/* 画像クロップ用のDialog */}
        <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
          <DialogContent className="w-80">
            <DialogTitle className="sr-only">画像をクロップ</DialogTitle>
            {selectedFile && (
              <ImageCropper
                image={selectedFile}
                resultWidth={400}
                onCrop={(dataUrl) => {
                  form.setValue("avatar", dataUrl);
                  setCropDialogOpen(false);
                }}
                onCancel={() => {
                  setCropDialogOpen(false);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
