"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { SiDiscord } from "@icons-pack/react-simple-icons";
import { authClient } from "@workspace/auth/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const params = useSearchParams();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">おかえりなさい</CardTitle>
          <CardDescription>サブスクリプションを管理しましょう</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              authClient.signIn.social({
                provider: "discord",
                callbackURL: `/account?${params.toString()}`,
              });
            }}
            variant="outline"
            className="w-full"
          >
            <SiDiscord color="default" />
            Discord でログイン
          </Button>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        続行することで、<Link href="/terms">利用規約</Link> および
        <Link href="/privacy">プライバシーポリシー</Link>
        に同意したものとみなされます。
      </div>
    </div>
  );
}
