import { SidebarLinkButon } from "@/components/sidebar-link-button";
import { getMessage } from "@/lib/i18n/server";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";

interface DocItem {
  title: string;
  url: string;
  sponsors?: boolean;
}

interface DocSidebarProps extends React.ComponentProps<typeof Sidebar> {
  docItems: {
    gettingStarted: DocItem[];
    guides: DocItem[];
    reference: DocItem[];
  };
}

export async function DocSidebar({ docItems, ...props }: DocSidebarProps) {
  const t = await getMessage("DocsSidebar");

  const data = {
    navGroup: [
      {
        title: t.gettingStarted,
        items: docItems.gettingStarted,
      },
      {
        title: t.guides,
        items: docItems.guides,
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
                  <SidebarLinkButon prefetch href={item.url}>
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
