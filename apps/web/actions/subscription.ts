"use server";

import { auth } from "@workspace/auth";
import { PlanId } from "@workspace/lib/plan";
import { headers } from "next/headers";

export const upgradeSubscription = async ({
  plan,
  annual,
}: {
  plan: PlanId;
  annual: boolean;
}) => {
  await auth.api.upgradeSubscription({
    body: {
      plan,
      annual,
    },
    headers: await headers(),
  });
};
