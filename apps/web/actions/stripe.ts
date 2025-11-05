"use server";

import { currentSession } from "@workspace/auth";
import { stripe } from "@workspace/auth/stripe";
import { User } from "@workspace/db";
import { baseUrl } from "@workspace/registry/lib/base-url";
import { redirect } from "next/navigation";

export const redirectToBillingPortal = async () => {
  const session = await currentSession();
  const stripeCustomerId = (session.user as User).stripeCustomerId;

  if (!stripeCustomerId) {
    throw new Error("Stripe customer ID not found");
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: baseUrl() + "/account",
  });

  redirect(portal.url);
};
