import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getMessage } from "@/lib/i18n/server";
import { archive, links, tools } from "@/lib/nav";
import { NINO_PLUS_URL } from "@workspace/lib/constants";
import { ArrowUpRight, Menu } from "lucide-react";
import Link from "next/link";

export async function MobileNav() {
  const t = await getMessage("MainNav");

  return (
    <>
      {/* Dialog trigger button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="xl:hidden p-2" size="icon" variant="ghost">
            <Menu />
            <span className="sr-only">メニュー</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {links.map((link) => (
            <DropdownMenuItem key={link.href} asChild>
              <Link href={link.href}>{t[link.labelKey]}</Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>ツール</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {tools.map((tool) => (
                <DropdownMenuItem key={tool.href} asChild>
                  <a href={tool.href} target="_blank">
                    {t[tool.labelKey].label}
                  </a>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              {archive.map((archiveItem) => (
                <DropdownMenuItem key={archiveItem.href} asChild>
                  <a href={archiveItem.href} target="_blank">
                    {t[archiveItem.labelKey].label}
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
            <DropdownMenuItem asChild>
              <a href={NINO_PLUS_URL} target="_blank">
                nino+
                <ArrowUpRight className="size-4" />
              </a>
            </DropdownMenuItem>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
