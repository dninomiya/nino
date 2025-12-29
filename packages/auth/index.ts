import { db } from "@workspace/db";
import { GithubAccount } from "./github";
import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { inviteUserToOrganization } from "./github";
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
    }),
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
    query: { accountId: account.accountId },
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
