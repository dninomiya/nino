import { Button } from "@/components/ui/button";
import Link from "next/link";

const links = [
  {
    href: "/examples/better-auth/mypage",
    label: "マイページ",
  },
  {
    href: "/examples/better-auth/logout",
    label: "ログアウト",
  },
  {
    href: "/examples/better-auth/signup",
    label: "新規登録",
  },
];

export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      {links.map((link) => (
        <Button
          key={link.href}
          variant="outline"
          className="justify-start"
          asChild
        >
          <Link href={link.href}>{link.label}</Link>
        </Button>
      ))}
    </div>
  );
}
