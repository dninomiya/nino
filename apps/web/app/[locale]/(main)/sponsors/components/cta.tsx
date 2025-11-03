"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@workspace/auth/client";
import { PlanId, PLANS } from "@workspace/lib/plan";
import { useQueryState } from "nuqs";
import { useEffect } from "react";

export function CTA() {
  const { data: session } = authClient.useSession();
  const [plan, setPlan] = useQueryState("plan");
  const [annual, setAnnual] = useQueryState("annual");

  useEffect(() => {
    if (plan) {
      authClient.subscription
        .upgrade({
          plan: plan as PlanId,
          annual: annual === "true",
        })
        .then(() => {
          setPlan(null);
          setAnnual(null);
        });
    }
  }, [plan, annual]);

  return (
    <section className="py-10 space-y-4">
      <h2 className="text-3xl font-bold">スポンサーになる</h2>

      <div>
        {PLANS.map((plan) => (
          <div key={plan.id}>
            <p>{plan.id}</p>
            <p>{plan.label}</p>
          </div>
        ))}
      </div>

      {session ? (
        <div className="flex flex-col gap-2">
          <p>すでにログインしています。</p>
          <Button
            onClick={() => {
              authClient.signOut();
            }}
          >
            ログアウト
          </Button>
        </div>
      ) : (
        <p>ログインしてスポンサーになる</p>
      )}

      <p>3,500円/月</p>

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
