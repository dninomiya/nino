import { Logo } from "@workspace/ui/blocks/logo/logo";
import { ModeToggle } from "@/components/mode-toggle";
import LocaleToggle from "./locale-toggle";

export const Header = () => {
  return (
    <div className="sticky top-0 z-50 h-14 flex items-center gap-2 px-4">
      <Logo />
      <span className="flex-1" />
      <LocaleToggle />
      <ModeToggle />
    </div>
  );
};
