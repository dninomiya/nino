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
import { archive, links, tools } from "@/lib/nav";
import { NINO_PLUS_URL } from "@workspace/lib/constants";
import { ArrowUpRight, Menu } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function MobileNav() {
  const t = useTranslations("MobileNav");

  return (
    <>
      {/* Dialog trigger button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="xl:hidden p-2" size="icon" variant="ghost">
            <Menu />
            <span className="sr-only">{t("menu")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {links.map((link) => (
            <DropdownMenuItem key={link.href} asChild>
              <Link href={link.href}>{link.label}</Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>{t("tools")}</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {tools.map((tool) => (
                <DropdownMenuItem key={tool.href} asChild>
                  <Link href={tool.href}>{tool.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              {archive.map((archive) => (
                <DropdownMenuItem key={archive.href} asChild>
                  <Link href={archive.href}>{archive.label}</Link>
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
