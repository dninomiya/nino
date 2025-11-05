import { getSubscriptionCount } from "@/data/subscription";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { Heart } from "lucide-react";

export async function SponsorButton() {
  "use cache";

  const subscriptionCount = await getSubscriptionCount();

  return (
    <Button variant="outline" asChild>
      <Link href="/sponsors">
        <Heart className="text-pink-500" />
        <span className="hidden lg:inline">スポンサー</span>
        <span>{subscriptionCount}</span>
      </Link>
    </Button>
  );
}
