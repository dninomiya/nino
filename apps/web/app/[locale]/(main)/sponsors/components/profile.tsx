import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getActiveSubscription } from "@workspace/auth/subscription";
import { getPlanLabel } from "@workspace/lib/plan";

export async function Profile() {
  "use cache: private";

  const subscription = await getActiveSubscription();

  if (!subscription) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>スポンサープロフィール</CardTitle>
      </CardHeader>

      <CardContent>{getPlanLabel(subscription.plan)}</CardContent>
    </Card>
  );
}
