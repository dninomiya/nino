import { Logo } from "@workspace/ui/blocks/logo/logo";
import { ModeToggle } from "@/components/mode-toggle";
import LocaleToggle from "./locale-toggle";
import { GlobalSearch } from "./global-search";
import { MainNav } from "./main-nav";
import { Heart } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export const Header = () => {
  return (
    <div className="sticky bg-background top-0 z-50 h-16 flex items-center gap-2 px-8 border-b">
      <Logo />
      <MainNav />
      <span className="flex-1" />
      <GlobalSearch />
      <LocaleToggle />
      <ModeToggle />
      <Button variant="outline">
        <Heart className="text-pink-500" />
        スポンサー
        <span>3</span>
      </Button>
      {/* <InviteNino /> */}
    </div>
  );
};
