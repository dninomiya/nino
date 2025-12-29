import { Button } from "@workspace/ui/components/button";
import { Heart } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function SponsorButton() {
  return (
    <Button variant="outline" asChild>
      <a href="https://dninomiya.notion.site/sponsor" target="_blank" rel="noopener noreferrer">
        <Heart className="text-pink-500" />
        <span>スポンサー</span>
      </a>
    </Button>
  );
}

export function SponsorButtonWithDropdownMenuItem() {
  return (
    <DropdownMenuItem asChild>
      <a href="https://dninomiya.notion.site/sponsor" target="_blank" rel="noopener noreferrer">
        <Heart className="text-pink-500" />
        <span>スポンサー</span>
      </a>
    </DropdownMenuItem>
  );
}
