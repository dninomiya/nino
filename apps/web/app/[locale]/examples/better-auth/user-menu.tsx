import { auth, getSession } from "@workspace/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { headers } from "next/headers";
import { refresh } from "next/cache";

export async function UserMenu() {
  const session = await getSession();

  if (!session) {
    return (
      <>
        <Button variant="outline" asChild>
          <Link href="/examples/better-auth/login">ログイン</Link>
        </Button>
        <Button asChild>
          <Link href="/examples/better-auth/signup">新規登録</Link>
        </Button>
      </>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await auth.api.signOut({
          headers: await headers(),
        });
        refresh();
      }}
    >
      <Button variant="outline">ログアウト</Button>
    </form>
  );
}
