import { ModeToggle } from "@/components/mode-toggle";
import { Logo } from "@workspace/ui/blocks/logo/logo";
import { GlobalSearch } from "./global-search";
import LocaleToggle from "./locale-toggle";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";

export const Header = () => {
  return (
    <div className="fixed w-full bg-background top-0 z-50 h-header flex items-center gap-2 px-4 xl:px-8 border-b">
      <MobileNav />
      <Logo />
      <MainNav />
      <span className="flex-1" />
      <GlobalSearch />
      <LocaleToggle />
      <ModeToggle />
      {/* <Button variant="outline">
        <Heart className="text-pink-500" />
        スポンサー
        <span>3</span>
      </Button> */}
      {/* <InviteNino /> */}
    </div>
  );
};
