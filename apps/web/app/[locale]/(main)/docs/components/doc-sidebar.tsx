"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMessage } from "@/components/i18n-provider";

const getDocItems = (category: string) => {
  const docsConfig = {
    categories: [
      {
        title: "gettingStarted",
        items: ["changelog"],
      },
      {
        title: "guides",
        items: [],
      },
      {
        title: "reference",
        items: [],
      },
    ],
  };

  return (
    docsConfig.categories
      .find((cat) => cat.title === category)
      ?.items.map((item) => ({
        title: item,
        url: `/docs/${item}`,
      })) || []
  );
};

export function DocSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const t = useMessage("DocsSidebar");

  const data = {
    navGroup: [
      {
        title: t.gettingStarted,
        items: getDocItems("gettingStarted"),
      },
      {
        title: t.guides,
        items: getDocItems("guides"),
      },
      {
        title: t.reference,
        items: getDocItems("reference"),
      },
    ],
  };

  return (
    <Sidebar
      className="top-(--spacing-header) h-[calc(100svh-var(--spacing-header))]!"
      {...props}
    >
      <SidebarHeader>
        <div className="px-1 text-sm pt-3">{t.title}</div>
      </SidebarHeader>
      <SidebarContent>
        {data.navGroup.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>{item.title}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
