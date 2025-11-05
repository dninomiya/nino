"use client";

import { upgradeSubscription } from "@/actions/subscription";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authClient } from "@workspace/auth/client";
import { getCommunityPlanPrices, PlanId, PLANS } from "@workspace/lib/plan";
import { Switch } from "@workspace/ui/components/switch";
import { useQueryState } from "nuqs";
import { useEffect } from "react";

export function CTA() {
  const { data: session } = authClient.useSession();
  const [plan, setPlan] = useQueryState("plan");
  const [annual, setAnnual] = useQueryState("annual");
  const prices = getCommunityPlanPrices();

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
    <section className="py-10 space-y-4">
      <h2 className="text-3xl font-bold">スポンサーになる</h2>

      <div className="flex items-center space-x-2">
        <Switch
          id="annual"
          checked={annual === "true"}
          onCheckedChange={(status) => setAnnual(status ? "true" : "false")}
        />
        <Label htmlFor="annual">年払い</Label>
      </div>

      <p>
        {annual === "true" ? prices?.primary.price / 12 : prices?.monthly.price}
        円/月
      </p>

      <Button
        onClick={() => {
          if (session) {
            alert("すでにログインしています。");
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
    </section>
  );
}
