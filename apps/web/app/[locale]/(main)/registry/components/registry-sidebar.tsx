import * as React from "react";

import { SidebarLinkButon } from "@/components/sidebar-link-button";
import { getMessage } from "@/lib/i18n/server";
import { gettingStartedItems, registries } from "@/lib/registry";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";

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

export async function RegistrySidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const t = await getMessage("RegistrySidebar");

  const data = {
    navGroup: [
      {
        title: t.gettingStarted,
        items: getGettingStartedItems(),
      },
      // {
      //   title: t.blocks,
      //   items: getRegistryItems("registry:block"),
      // },
      {
        title: t.components,
        items: getRegistryItems("registry:component"),
      },
      {
        title: t.libraries,
        items: getRegistryItems("registry:lib"),
      },
    ],
  };

  return (
    <Sidebar
      className="top-header h-[calc(100svh-var(--spacing-header))]!"
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
                  <SidebarLinkButon href={item.url}>
                    {item.title}
                  </SidebarLinkButon>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
