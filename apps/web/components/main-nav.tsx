"use client";

import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@workspace/ui/components/navigation-menu";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const links = [
  { href: "/docs", label: "ドキュメント" },
  { href: "/registry", label: "レジストリ" },
  { href: "/templates", label: "テンプレート" },
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
