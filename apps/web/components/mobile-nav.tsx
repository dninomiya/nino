import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getMessage } from "@/lib/i18n/server";
import { archive, demos, links, tools } from "@/lib/nav";
import { NINO_PLUS_URL } from "@workspace/lib/constants";
import { ArrowUpRight, Menu } from "lucide-react";
import Link from "next/link";
import { LocaleToggleWithDropdownMenuItem } from "./locale-toggle";
import { ModeToggleWithDropdownMenuItem } from "./mode-toggle";
import { SponsorButtonWithDropdownMenuItem } from "./sponsor-button";

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
            <DropdownMenuSubTrigger>{t["links"]}</DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="max-h-[70dvh] overflow-auto">
              <DropdownMenuLabel>{t["tools"]}</DropdownMenuLabel>
              {tools.map((tool) => (
                <DropdownMenuItem key={tool.href} asChild>
                  <a href={tool.href} target="_blank">
                    {t[tool.labelKey].label}
                    <ArrowUpRight className="size-3" />
                  </a>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>{t["demos"]}</DropdownMenuLabel>
              {demos.map((demo) => (
                <DropdownMenuItem key={demo.href} asChild>
                  <a href={demo.href} target="_blank">
                    {t[demo.labelKey].label}
                    <ArrowUpRight className="size-3" />
                  </a>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>{t["archive"]}</DropdownMenuLabel>
              {archive.map((archiveItem) => (
                <DropdownMenuItem key={archiveItem.href} asChild>
                  <a href={archiveItem.href} target="_blank">
                    {t[archiveItem.labelKey].label}
                    <ArrowUpRight className="size-3" />
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
            <DropdownMenuItem asChild>
              <a href={NINO_PLUS_URL} target="_blank">
                nino+
                <ArrowUpRight className="size-3" />
              </a>
            </DropdownMenuItem>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <LocaleToggleWithDropdownMenuItem />
          <ModeToggleWithDropdownMenuItem />
          <SponsorButtonWithDropdownMenuItem />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
