import { auth, getSession } from ".";
import { headers } from "next/headers";
import { PlanId } from "@workspace/lib/plan";

export const getActiveSubscription = async () => {
  const session = await getSession();

  if (!session) {
    return;
  }

  const subscriptions = await auth.api.listActiveSubscriptions({
    headers: await headers(),
  });

  const activeSubscription = subscriptions.find(
    (sub) => sub.status === "active" || sub.status === "trialing"
  );

  return activeSubscription;
};

const isSponsor = async () => {
  const subscription = await getActiveSubscription();
  return subscription?.plan === "community";
};

export const getPlanId = async () => {
  const subscription = await getActiveSubscription();

  return subscription?.plan as PlanId | undefined;
};
