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
import { registries } from "@/lib/registry";

export function RegistrySidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const data = {
    navGroup: [
      {
        title: "Blocks",
        items: registries
          .filter((registry) => registry.type === "registry:block")
          .map((registry) => ({
            title: registry.title,
            url: `/registry/${registry.name}`,
          })),
      },
      {
        title: "Libraries",
        items: registries
          .filter((registry) => registry.type === "registry:lib")
          .map((registry) => ({
            title: registry.title,
            url: `/registry/${registry.name}`,
          })),
      },
    ],
  };

  return (
    <Sidebar
      className="top-(--spacing-header) h-[calc(100svh-var(--spacing-header))]!"
      {...props}
    >
      <SidebarHeader>
        <div className="px-1 text-sm pt-3">レジストリ</div>
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
