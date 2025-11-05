import { redirectToBillingPortal } from "@/actions/stripe";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPlanId } from "@workspace/auth/subscription";
import { currentSession } from "@workspace/auth";
import { Metadata } from "next";
import Link from "next/link";
import DeleteAccount from "./components/delete-account";
import UserProfile from "./components/user-profile";
import IntegrationMenu from "./components/integration-menu";

export const metadata: Metadata = {
  title: "アカウント",
};

export default async function AccountPage() {
  "use cache: private";

  const { user } = await currentSession();
  const planId = await getPlanId();

  return (
    <div className="py-14">
      <h1 className="font-bold text-center text-2xl mb-6">アカウント</h1>

      <div className="container">
        <Card className="mx-auto max-w-xl">
          <CardContent className="space-y-8">
            <UserProfile user={user} plan={planId} />

            {planId ? (
              <form action={redirectToBillingPortal}>
                <Button>サブスクリプション管理</Button>
              </form>
            ) : (
              <Button asChild>
                <Link href="/#plans">プランを見る</Link>
              </Button>
            )}

            {planId && <IntegrationMenu />}
          </CardContent>
        </Card>
        <div className="text-center mt-4">
          <DeleteAccount />
        </div>
      </div>
    </div>
  );
}
