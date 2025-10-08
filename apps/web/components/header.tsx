import { Logo } from "@workspace/ui/blocks/logo/logo";

export const Header = () => {
  return (
    <div className="sticky top-0 z-50 w-full bg-background/50 backdrop-blur-sm">
      <Logo />
    </div>
  );
};
