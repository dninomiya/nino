import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { UserMenu } from "./user-menu";
import { Lock } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container py-10 space-y-6">
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/examples/better-auth/">
            <Lock />
            ユーザー専用画面
          </Link>
        </Button>
        <span className="flex-1" />
        <Suspense>
          <UserMenu />
        </Suspense>
      </div>
      <div>{children}</div>
    </div>
  );
}
