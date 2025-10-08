import { Logo } from "@workspace/ui/blocks/logo/logo";

export const Header = () => {
  return (
    <div className="sticky top-0 z-50 h-14 flex items-center gap-2 px-4">
      <Logo />
    </div>
  );
};
