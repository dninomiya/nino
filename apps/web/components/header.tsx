import { ModeToggle } from "@/components/mode-toggle";
import { Logo } from "@workspace/ui/blocks/logo/logo";
import { GlobalSearch } from "./global-search";
import LocaleToggle from "./locale-toggle";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { SponsorButton } from "./sponsor-button";
import { UserMenu } from "./user-menu";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DevOnly } from "./dev-only";

export function Header() {
  return (
    <div className="fixed w-full bg-background top-0 z-50 h-header flex items-center gap-2 px-4 xl:px-8 border-b">
      <MobileNav />
      <Logo />
      <MainNav />
      <span className="flex-1" />
      <GlobalSearch />
      <LocaleToggle />
      <ModeToggle />
      <DevOnly>
        <SponsorButton />
        <Suspense fallback={<Skeleton className="size-9 rounded-full" />}>
          <UserMenu />
        </Suspense>
      </DevOnly>
    </div>
  );
}
