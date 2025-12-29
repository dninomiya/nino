import * as React from "react";

import { SidebarLinkButon } from "@/components/sidebar-link-button";
import { getMessage } from "@/lib/i18n/server";
import {
  gettingStartedItems,
  getRegistryDocMetas,
  registries,
} from "@/lib/registry";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";

const getRegistryItems = async (type: string) => {
  const allMetas = await getRegistryDocMetas();
  return registries
    .filter((registry) => registry.type === type)
    .map((registry) => {
      const meta = allMetas.find((m) => m.name === registry.name);
      return {
        title: registry.title,
        url: `/registry/${registry.name}`,
        sponsors: meta?.sponsors,
      };
    });
};

const getGettingStartedItems = async () => {
  const allMetas = await getRegistryDocMetas();
  return gettingStartedItems.map((item) => {
    const meta = allMetas.find((m) => m.name === item.name);
    return {
      title: item.title,
      url: `/registry/${item.name}`,
      sponsors: meta?.sponsors,
    };
  });
};

export async function RegistrySidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const t = await getMessage("RegistrySidebar");

  const data = {
    navGroup: [
      {
        title: t.gettingStarted,
        items: await getGettingStartedItems(),
      },
      // {
      //   title: t.blocks,
      //   items: await getRegistryItems("registry:block"),
      // },
      {
        title: t.components,
        items: await getRegistryItems("registry:component"),
      },
      {
        title: t.libraries,
        items: await getRegistryItems("registry:lib"),
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
                    <span className="truncate">{item.title}</span>
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
