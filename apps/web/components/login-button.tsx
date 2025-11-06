"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@workspace/auth/client";
import { usePathname } from "next/navigation";

export function LoginButton() {
  const pathname = usePathname();

  return (
    <Button
      onClick={() =>
        authClient.signIn.social({
          provider: "discord",
          callbackURL: pathname,
        })
      }
    >
      ログイン
    </Button>
  );
}
