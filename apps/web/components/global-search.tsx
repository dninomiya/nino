"use client";

import { Languages, Monitor, Moon, SearchIcon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

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
import { useParams, usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { useRegistry } from "./registry-provider";
import { useDictionary, useI18n } from "./i18n-provider";
import { Locale, locales } from "@/lib/i18n/locale";

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { theme, setTheme } = useTheme();
  const { registryDocMetas } = useRegistry();
  const [isPending, startTransition] = useTransition();
  const t = useDictionary("GlobalSearch");
  const langT = useDictionary("Langulage");
  const { locale: currentLocale } = useI18n();

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
        className="w-48 justify-start font-normal hidden xl:flex"
      >
        <SearchIcon />
        <span className="mr-auto">{t["searchPlaceholder"]}</span>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </Button>
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        size="icon"
        className="xl:hidden"
      >
        <SearchIcon />
        <span className="sr-only">{t["searchLabel"]}</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t["searchPlaceholder"]} />
        <CommandList>
          <CommandEmpty>{t["noResults"]}</CommandEmpty>
          <CommandGroup heading={t["registry"]}>
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
          <CommandGroup heading={t["theme"]}>
            <CommandItem
              onSelect={() => {
                setTheme("light");
              }}
            >
              <Sun />
              <span>{t["light"]}</span>
              <small className="text-muted-foreground">Light</small>
              {theme === "light" && (
                <Badge variant="outline" className="ml-auto">
                  {t["current"]}
                </Badge>
              )}
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setTheme("dark");
              }}
            >
              <Moon />
              <span>{t["dark"]}</span>
              <small className="text-muted-foreground">Dark</small>
              {theme === "dark" && (
                <Badge variant="outline" className="ml-auto">
                  {t["current"]}
                </Badge>
              )}
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setTheme("system");
              }}
            >
              <Monitor />
              <span>{t["system"]}</span>
              <small className="text-muted-foreground">System</small>
              {theme === "system" && (
                <Badge variant="outline" className="ml-auto">
                  {t["current"]}
                </Badge>
              )}
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={t["language"]} aria-busy={isPending}>
            {locales.map((locale) => (
              <CommandItem
                key={locale}
                onSelect={() => handleLocaleChange(locale as Locale)}
              >
                <Languages />
                <span>{langT[locale]}</span>
                {currentLocale === locale && (
                  <Badge variant="outline" className="ml-auto">
                    {t["current"]}
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
