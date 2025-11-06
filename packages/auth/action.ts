"use server";

import { headers } from "next/headers";
import { auth, currentSession, getDiscordAccount, getGithubAccount } from ".";
import { baseUrl } from "@workspace/registry/lib/base-url";
import { refreshIntegrations } from "./integration";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getActiveSubscription, getPlanId } from "./subscription";
import { addDiscordRole, removeDiscordRole } from "./discord";
import { removeUserFromOrganization } from "./github";

export const signOut = async () => {
  await auth.api.signOut({
    headers: await headers(),
  });
};

export const deleteAccount = async () => {
  const subscriptions = await auth.api.listActiveSubscriptions({
    headers: await headers(),
  });

  const session = await currentSession();

  // すべてキャンセル
  for (const subscription of subscriptions) {
    await auth.api.cancelSubscription({
      headers: await headers(),
      body: {
        subscriptionId: subscription.id,
        returnUrl: baseUrl() + "/account",
      },
    });
  }

  // すべて連携解除
  await refreshIntegrations(session.user.id);

  await auth.api.deleteUser({
    headers: await headers(),
    body: {},
  });

  redirect("/");
};

export const linkDiscord = async () => {
  const account = await getDiscordAccount();
  const activeSubscription = await getActiveSubscription();

  if (account && activeSubscription) {
    await removeDiscordRole(account.accountId, activeSubscription.plan);
  }

  const result = await auth.api.linkSocialAccount({
    headers: await headers(),
    body: {
      provider: "discord",
      callbackURL: baseUrl() + "/account",
    },
  });

  redirect(result.url);
};

export const linkGithub = async () => {
  const result = await auth.api.linkSocialAccount({
    headers: await headers(),
    body: {
      provider: "github",
      callbackURL: baseUrl() + "/account",
    },
  });

  redirect(result.url);
};

export const linkNotion = async () => {
  await auth.api.linkSocialAccount({
    headers: await headers(),
    body: {
      provider: "notion",
      callbackURL: baseUrl() + "/account",
    },
  });
};

export const unlinkAccount = async (providerId: string) => {
  await auth.api.unlinkAccount({
    headers: await headers(),
    body: {
      providerId,
    },
  });
};

export const unlinkGitHub = async () => {
  const githubAccount = await getGithubAccount();

  if (githubAccount) {
    try {
      await removeUserFromOrganization(githubAccount.id);
    } catch (error) {
      console.error(error);
    }
  }

  return auth.api
    .unlinkAccount({
      headers: await headers(),
      body: {
        providerId: "github",
      },
    })
    .then(() => {
      revalidatePath("/account");
    });
};

export const syncDiscordRole = async () => {
  const discordAccount = await getDiscordAccount();
  const planId = await getPlanId();

  if (discordAccount && planId) {
    await addDiscordRole(discordAccount.id, planId);
  }
};
