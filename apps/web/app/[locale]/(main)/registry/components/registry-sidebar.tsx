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
import { registries, gettingStartedItems } from "@/lib/registry";
import { useMessage } from "@/components/i18n-provider";

const getRegistryItems = (type: string) => {
  return registries
    .filter((registry) => registry.type === type)
    .map((registry) => ({
      title: registry.title,
      url: `/registry/${registry.name}`,
    }));
};

const getGettingStartedItems = () => {
  return gettingStartedItems.map((item) => ({
    title: item.title,
    url: `/registry/${item.name}`,
  }));
};

export function RegistrySidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const t = useMessage("RegistrySidebar");

  const data = {
    navGroup: [
      {
        title: t.gettingStarted,
        items: getGettingStartedItems(),
      },
      {
        title: t.blocks,
        items: getRegistryItems("registry:block"),
      },
      {
        title: t.libraries,
        items: getRegistryItems("registry:lib"),
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
