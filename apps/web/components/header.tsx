import { ModeToggle } from "@/components/mode-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@workspace/ui/blocks/logo/logo";
import { Suspense } from "react";
import { GlobalSearch } from "./global-search";
import LocaleToggle from "./locale-toggle";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { SponsorButton } from "./sponsor-button";
import { UserMenu } from "./user-menu";

export function Header() {
  return (
    <div className="fixed w-full bg-background top-0 z-50 h-header flex items-center gap-2 px-4 xl:px-8 border-b">
      <MobileNav />
      <Logo />
      <MainNav />
      <span className="flex-1" />
      <GlobalSearch />
      <div className="hidden md:flex items-center gap-2">
        <LocaleToggle />
        <ModeToggle />
        <SponsorButton />
      </div>
      <Suspense fallback={<Skeleton className="size-9 rounded-full" />}>
        <UserMenu />
      </Suspense>
    </div>
  );
}
