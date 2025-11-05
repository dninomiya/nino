import { DISCORD_DM_URL } from "@workspace/lib/constants";
import { PlanId } from "@workspace/lib/plan";
import { ArrowUpRight, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "@workspace/auth/action";

export default function UserMenu() {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">メニュー</h2>

      <div className="flex gap-2 *:justify-start flex-col">
        <Button variant="outline" asChild>
          <Link href={DISCORD_DM_URL} target="_blank">
            💬 お問い合わせ
            <ArrowUpRight className="ml-auto" />
          </Link>
        </Button>

        <form action={signOut}>
          <Button variant="outline">
            <LogOut />
            ログアウト
          </Button>
        </form>
      </div>
    </div>
  );
}
