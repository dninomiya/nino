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
import { Lock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsSponsor } from "@/hooks/use-is-sponsor";
import { cn } from "@/lib/utils";

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

export function DocSidebar({ docItems, ...props }: DocSidebarProps) {
  const pathname = usePathname();
  const t = useMessage("DocsSidebar");
  const { isSponsor } = useIsSponsor();

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
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={cn(item.sponsors && !isSponsor && "opacity-50")}
                  >
                    <Link href={item.url}>
                      {item.title}
                      {item.sponsors && !isSponsor && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Lock className="ml-auto" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>このドキュメントはスポンサー限定です</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </Link>
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
