"use client";

import {
  CreditCard,
  Monitor,
  Moon,
  SearchIcon,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { getRegistryDocMetas } from "@/lib/registry";
import { Button } from "@workspace/ui/components/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@workspace/ui/components/command";
import { Kbd } from "@workspace/ui/components/kbd";
import { useRouter } from "next/navigation";
import { useRegistry } from "./registry-provider";

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();
  const { registryDocMetas } = useRegistry();

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
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setTheme("dark");
              }}
            >
              <Moon />
              <span>ダーク</span>
              <small className="text-muted-foreground">Dark</small>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setTheme("system");
              }}
            >
              <Monitor />
              <span>システム</span>
              <small className="text-muted-foreground">System</small>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
