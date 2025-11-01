import { db } from "@workspace/db";
import { accounts } from "@workspace/db/schemas/auth";
import { eq } from "drizzle-orm";
import { addDiscordRole, removeAllDiscordRoles } from "./discord";
import { inviteUserToOrganization, removeUserFromOrganization } from "./github";

export const refreshIntegrations = async (userId: string, plan?: string) => {
  console.log("連携を更新します。");

  const accounts = await getUserAccounts(userId);
  const discordAccount = accounts.find(
    (account) => account.providerId === "discord"
  );
  const githubAccount = accounts.find(
    (account) => account.providerId === "github"
  );

  if (plan) {
    if (discordAccount) {
      await removeAllDiscordRoles(discordAccount.accountId);
      await addDiscordRole(discordAccount.accountId, plan);
    }
    if (githubAccount) {
      await inviteUserToOrganization(Number(githubAccount.accountId));
    }
    console.log("DiscordとGitHubの連携が完了しました。");
  } else {
    if (discordAccount) {
      await removeAllDiscordRoles(discordAccount.accountId);
    }
    if (githubAccount) {
      await removeUserFromOrganization(Number(githubAccount.accountId));
    }
    console.log("DiscordとGitHubの連携が解除されました。");
  }
};

export const getUserAccounts = async (userId: string) => {
  return db.query.accounts.findMany({
    where: eq(accounts.userId, userId),
  });
};
