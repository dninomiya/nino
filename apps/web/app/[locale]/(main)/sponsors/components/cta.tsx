"use client";

import { redirectToBillingPortal } from "@/actions/stripe";
import { upgradeSubscription } from "@/actions/subscription";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authClient } from "@workspace/auth/client";
import { getCommunityPlanPrices, PlanId } from "@workspace/lib/plan";
import { Switch } from "@workspace/ui/components/switch";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

export function CTA() {
  const { data: session } = authClient.useSession();
  const [plan, setPlan] = useQueryState("plan");
  const [annual, setAnnual] = useQueryState("annual");
  const prices = getCommunityPlanPrices();
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    authClient.subscription.list().then((subscriptions) => {
      setHasSubscription(
        subscriptions.data?.some(
          (subscription) => subscription.status === "active"
        ) ?? false
      );
    });
  }, []);

  useEffect(() => {
    if (plan) {
      upgradeSubscription({
        plan: plan as PlanId,
        annual: annual === "true",
      }).then(() => {
        setPlan(null);
        setAnnual(null);
      });
    }
  }, [plan, annual]);

  return (
    <section>
      <h2>スポンサーになる</h2>

      <div className="flex items-center space-x-2">
        <Switch
          id="annual"
          checked={annual === "true"}
          onCheckedChange={(status) => setAnnual(status ? "true" : "false")}
        />
        <Label htmlFor="annual">年払い</Label>
      </div>

      <p>
        {annual === "true"
          ? (prices?.primary.price / 12).toLocaleString()
          : (prices?.monthly.price).toLocaleString()}
        円/月
      </p>

      <Button
        disabled={hasSubscription}
        onClick={() => {
          if (session) {
            if (hasSubscription) {
              redirectToBillingPortal();
            } else {
              upgradeSubscription({
                plan: "community",
                annual: annual === "true",
              });
            }
          } else {
            authClient.signIn.social({
              provider: "discord",
              callbackURL: "/sponsors?plan=community",
            });
          }
        }}
      >
        スポンサーになる
      </Button>
      {hasSubscription && (
        <p className="text-sm text-muted-foreground">
          あなたはすでにスポンサーです。ありがとうございます！
        </p>
      )}
    </section>
  );
}
