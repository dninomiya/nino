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
import { archive, links, tools } from "@/lib/nav";

export function MainNav() {
  return (
    <NavigationMenu viewport={false} className="hidden xl:block">
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
