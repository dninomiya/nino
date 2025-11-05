import { Button } from "@/components/ui/button";
import { authClient } from "@workspace/auth/client";
import { signOut } from "@workspace/auth/action";
import { LogOut, User } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { getSession } from "@workspace/auth";
import { getPlanId } from "@workspace/auth/subscription";
import { getPlanLabel } from "@workspace/lib/plan";
import Link from "next/link";

export async function UserMenu() {
  const session = await getSession();

  if (!session) {
    return (
      <Button onClick={() => authClient.signIn.social({ provider: "discord" })}>
        ログイン
      </Button>
    );
  }

  const planId = await getPlanId();

  const user = session.user;
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="size-full">
            <AvatarImage src={user.image || undefined} alt="" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-xs text-muted-foreground">
            {planId ? getPlanLabel(planId) : "ゲスト"}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account">
            <User />
            マイページ
          </Link>
        </DropdownMenuItem>
        <form action={signOut}>
          <DropdownMenuItem>
            <LogOut />
            ログアウト
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
