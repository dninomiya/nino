import { getSubscriptionCount } from "@/data/subscription";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { Heart } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export async function SponsorButton() {
  "use cache";

  const subscriptionCount = await getSubscriptionCount();

  return (
    <Button variant="outline" asChild>
      <Link href="/sponsors">
        <Heart className="text-pink-500" />
        <span>スポンサー</span>
        <span>{subscriptionCount}</span>
      </Link>
    </Button>
  );
}

export async function SponsorButtonWithDropdownMenuItem() {
  "use cache";

  const subscriptionCount = await getSubscriptionCount();

  return (
    <DropdownMenuItem asChild>
      <Link href="/sponsors">
        <Heart className="text-pink-500" />
        <span>スポンサー</span>
        <span>{subscriptionCount}</span>
      </Link>
    </DropdownMenuItem>
  );
}
