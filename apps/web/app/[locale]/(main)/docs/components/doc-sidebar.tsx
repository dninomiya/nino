import { SidebarLinkButon } from "@/components/sidebar-link-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getMessage } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";
import { isSponsor } from "@workspace/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import { Lock } from "lucide-react";

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
  const sponsor = await isSponsor();

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
                  <SidebarLinkButon
                    prefetch
                    href={item.url}
                    className={cn(item.sponsors && !sponsor && "opacity-50")}
                  >
                    <span className="truncate">{item.title}</span>
                    {item.sponsors && !sponsor && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Lock className="ml-auto" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>このドキュメントはスポンサー限定です</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
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
