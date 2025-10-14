"use client";

import { Languages, Monitor, Moon, SearchIcon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@workspace/ui/components/command";
import { Kbd } from "@workspace/ui/components/kbd";
import { Locale, useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { useRegistry } from "./registry-provider";

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { theme, setTheme } = useTheme();
  const { registryDocMetas } = useRegistry();
  const currentLocale = useLocale();
  const [_, startTransition] = useTransition();
  const t = useTranslations("LocaleSwitcher");

  const handleLocaleChange = (nextLocale: Locale) => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale }
      );
    });
    setOpen(false);
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="w-48 justify-start font-normal"
      >
        <SearchIcon />
        <span className="mr-auto">検索...</span>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="検索..." />
        <CommandList>
          <CommandEmpty>検索結果がありません。</CommandEmpty>
          <CommandGroup heading="レジストリ">
            {registryDocMetas.map((meta) => (
              <CommandItem
                key={meta.title}
                onSelect={() => {
                  setOpen(false);
                  router.push(`/registry/${meta.name}`);
                }}
              >
                <span>{meta.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="テーマ">
            <CommandItem
              onSelect={() => {
                setTheme("light");
              }}
            >
              <Sun />
              <span>ライト</span>
              <small className="text-muted-foreground">Light</small>
              {theme === "light" && (
                <Badge variant="outline" className="ml-auto">
                  現在
                </Badge>
              )}
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setTheme("dark");
              }}
            >
              <Moon />
              <span>ダーク</span>
              <small className="text-muted-foreground">Dark</small>
              {theme === "dark" && (
                <Badge variant="outline" className="ml-auto">
                  現在
                </Badge>
              )}
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setTheme("system");
              }}
            >
              <Monitor />
              <span>システム</span>
              <small className="text-muted-foreground">System</small>
              {theme === "system" && (
                <Badge variant="outline" className="ml-auto">
                  現在
                </Badge>
              )}
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="言語">
            {routing.locales.map((locale) => (
              <CommandItem
                key={locale}
                onSelect={() => handleLocaleChange(locale as Locale)}
              >
                <Languages />
                <span>{t("locale", { locale })}</span>
                {currentLocale === locale && (
                  <Badge variant="outline" className="ml-auto">
                    現在
                  </Badge>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
