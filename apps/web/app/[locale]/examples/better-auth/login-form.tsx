"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@workspace/auth/client";
import { Spinner } from "@workspace/ui/components/spinner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { loginFormSchema } from "./zod";

type FormData = z.infer<typeof loginFormSchema>;

export function LoginForm({ signUp = false }: { signUp?: boolean }) {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: FormData) {
    if (signUp) {
      await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.email,
          callbackURL: "/examples/better-auth",
        },
        {
          onError(ctx) {
            alert(ctx.error.message);
          },
        }
      );
    }

    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: "/examples/better-auth",
      },
      {
        onError(ctx) {
          alert(
            ctx.error.status === 401
              ? "メールアドレスまたはパスワードが間違っています。"
              : ctx.error.message
          );
        },
      }
    );
  }

  const isPending = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{signUp ? "新規登録" : "ログイン"}</CardTitle>
            <CardDescription>
              {signUp
                ? "アカウントを作成するには、メールアドレスとパスワードを入力してください。"
                : "おかえりなさい！"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メールアドレス</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="email" type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>パスワード</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      autoComplete={
                        signUp ? "new-password" : "current-password"
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="gap-4">
            <Button disabled={isPending} type="submit">
              {signUp ? "新規登録" : "ログイン"}
            </Button>
            {isPending && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{signUp ? "登録" : "ログイン"}中...</span>
                <Spinner className="size-3" />
              </div>
            )}

            <Button
              variant="outline"
              className="ml-auto"
              type="button"
              onClick={() => {
                form.setValue("email", `test${Math.random()}@example.com`);
                form.setValue("password", "Password123!");
              }}
            >
              ランダムデータをセット
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
