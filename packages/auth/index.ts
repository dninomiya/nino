import { getActiveSubscription } from "./subscription";
import { db } from "@workspace/db";
import { GithubAccount } from "./github";
import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { addDiscordRole, joinDiscordGuild } from "./discord";
import { inviteUserToOrganization } from "./github";
import { refreshIntegrations } from "./integration";
import { updateMemberStatusToKicking } from "./notion";
import { PLANS } from "@workspace/lib/plan";
import { stripe as stripeClient } from "./stripe";
import { baseUrl } from "@workspace/registry/lib/base-url";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  baseURL: baseUrl(),
  database: drizzleAdapter(db, {
    provider: "sqlite",
    usePlural: true,
  }),
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  account: {
    accountLinking: {
      allowDifferentEmails: true,
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/callback/:id") {
        if (ctx.params.id === "github") {
          const githubAccount = await getGithubAccount();
          if (githubAccount) {
            await inviteUserToOrganization(githubAccount.id);
          }
        }
      }
      if (ctx.path === "/link-social") {
        const activeSubscription = await getActiveSubscription();
        const provider = ctx.body.provider;
        if (!activeSubscription) return;
        if (provider === "discord") {
          const discordAccount = await getDiscordAccount();
          if (discordAccount) {
            await addDiscordRole(
              discordAccount.accountId,
              activeSubscription.plan
            );
          }
        }
      }
    }),
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      scope: ["identify", "guilds.join"],
    },
  },
  advanced: {
    database: {
      generateId: () => nanoid(10),
    },
  },
  plugins: [
    nextCookies(),
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: PLANS.map((plan) => ({
          name: plan.id,
          priceId: plan.priceId,
          annualDiscountPriceId: plan.annualDiscountPriceId,
        })),
        getCheckoutSessionParams: async () => {
          return {
            params: {
              allow_promotion_codes: true,
              automatic_tax: {
                enabled: true,
              },
            },
          };
        },
        onSubscriptionComplete: async ({ subscription, plan }) => {
          await joinDiscordGuild(subscription.referenceId);
          await refreshIntegrations(subscription.referenceId, plan.name);
        },
        onSubscriptionUpdate: async ({ subscription }) => {
          await joinDiscordGuild(subscription.referenceId);
          await refreshIntegrations(
            subscription.referenceId,
            subscription.plan
          );
        },
        onSubscriptionDeleted: async ({ subscription }) => {
          await updateMemberStatusToKicking(subscription.referenceId);
          await refreshIntegrations(subscription.referenceId);
        },
      },
    }),
  ],
});

export const getSession = async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
};

export const currentSession = async () => {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
};

const getProviderAccount = async (provider: string) => {
  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });

  const account = accounts.find((account) => account.providerId === provider);

  if (!account) {
    return null;
  }

  const result = await auth.api.accountInfo({
    body: { accountId: account.accountId },
    headers: await headers(),
  });

  return result?.data;
};

export const getGithubAccount = async () => {
  return getProviderAccount("github") as Promise<GithubAccount>;
};

export const getDiscordAccount = async () => {
  return getProviderAccount("discord");
};

export const getNotionAccount = async () => {
  return getProviderAccount("notion");
};

export const isSponsor = async () => {
  const session = await getSession();
  if (!session) return false;
  const subscriptions = await auth.api.listActiveSubscriptions({
    headers: await headers(),
  });
  return subscriptions.some(
    (subscription) =>
      subscription.status === "active" || subscription.status === "trialing"
  );
};
