"use client";

import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@workspace/ui/components/navigation-menu";
import { Archive, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const links = [
  { href: "/docs", label: "ドキュメント" },
  { href: "/registry", label: "レジストリ" },
];

const tools = [
  {
    href: "https://dninomiya.github.io/tool-hub/",
    label: "ToolHub",
    description: "ツールのリンク集",
  },
  {
    href: "https://react-gude-plum.vercel.app/",
    label: "React Guide",
    description: "React ガイド",
  },
  {
    href: "https://next-dev-weld.vercel.app/dynamic-with-all",
    label: "Next.js レンダリングガイド",
    description: "Next.js のレンダリングガイド",
  },
  {
    href: "https://dninomiya.github.io/stripe-doc/payments/",
    label: "Stripe ビギナーズガイド",
    description: "Stripe のビギナーズガイド",
  },
  {
    href: "https://nextjs-play-app-routing.vercel.app/",
    label: "Next.js ルーティングガイド",
    description: "Next.js の特殊なルーティングのデモ",
  },
  {
    href: "https://hub.nino.plus/",
    label: "Hub",
    description: "Webアプリの実装デモ",
  },
  {
    href: "https://dninomiya.github.io/form-guide/",
    label: "ふぉーむがいど",
    description: "フォーム実装のベストプラクティス",
  },
  {
    href: "https://dninomiya.github.io/form-guide/stop-enter-submit",
    label: "Stop Enter Submit",
    description: "Enterキーでの誤送信防止を啓蒙ツール",
  },
  {
    href: "https://dninomiya.github.io/tree-to-image/",
    label: "Tree to Image",
    description: "ファイルツリーの画像化ツール",
  },
];

const archive = [
  {
    href: "https://nino-plus-old.vercel.app/",
    label: "nino+ 1.0",
    description: "メンタープラットフォーム",
  },
];

export function MainNav() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        {links.map((link) => (
          <NavigationMenuItem key={link.href}>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href={link.href}>{link.label}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}

        <NavigationMenuItem>
          <NavigationMenuTrigger>ツール</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {tools.map((tool) => (
                <ListItem key={tool.label} title={tool.label} href={tool.href}>
                  {tool.description}
                </ListItem>
              ))}
            </ul>
            <Separator className="my-4" />
            <h3 className="text-sm flex items-center font-semibold mb-2 px-2 text-muted-foreground">
              <Archive className="size-4 mr-2" />
              アーカイブ
            </h3>
            <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {archive.map((archive) => (
                <ListItem
                  key={archive.label}
                  title={archive.label}
                  href={archive.href}
                >
                  {archive.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link
              href="https://nino.plus"
              target="_blank"
              className="flex-row items-center gap-2"
            >
              メンバーシップ
              <ArrowUpRight className="size-4" />
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href} target="_blank">
          <div className="text-sm leading-none font-medium">
            {title}
            <ArrowUpRight className="size-3.5 ml-1 inline align-top" />
          </div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
