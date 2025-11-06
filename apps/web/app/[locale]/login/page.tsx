import { getSession } from "@workspace/auth";
import { Logo } from "@workspace/ui/blocks/logo/logo";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "./components/login-form";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/account");
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Logo noLink />
          <div className="font-black">nino</div>
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}
