import { Button } from "@/components/ui/button";
import { signOut } from "@workspace/auth/action";
import { DISCORD_DM_URL } from "@workspace/lib/constants";
import { ArrowUpRight, LogOut, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function UserMenu() {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">メニュー</h2>

      <div className="flex gap-2 *:justify-start flex-col">
        <Button variant="outline" asChild>
          <Link href={DISCORD_DM_URL} target="_blank">
            <MessageCircle />
            お問い合わせ
            <ArrowUpRight className="ml-auto" />
          </Link>
        </Button>

        <form action={signOut} className="contents">
          <Button variant="outline" className="justify-start">
            <LogOut />
            ログアウト
          </Button>
        </form>
      </div>
    </div>
  );
}
