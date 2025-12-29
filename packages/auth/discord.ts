import { auth, getDiscordAccount } from ".";
import { getUserAccounts } from "./integration";
import { PLANS } from "@workspace/lib/plan";

export const DISCORD_GUILD_ID = "760351462239895574";

export const addDiscordRole = async (
  discordAccountId: string,
  planId: string
) => {
  const roleId = PLANS.find((plan) => plan.id === planId)?.discordRoleId;

  if (!roleId) {
    console.log("ロールIDが見つかりませんでした。", planId);
    throw new Error("ロールIDが見つかりませんでした。");
  }

  const url = `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${discordAccountId}/roles/${roleId}`;
  const options = {
    method: "PUT",
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
  };

  return fetch(url, options)
    .then(async (res) => {
      if (res.ok) {
        console.log("ロールが正常に追加されました。");
      } else {
        console.error("ロール追加時にエラーが発生しました。", await res.json());
      }
    })
    .catch((err) => console.error("リクエスト中にエラーが発生しました：", err));
};

export const removeDiscordRole = async (
  discordAccountId: string,
  planId: string
) => {
  const roleId = PLANS.find((plan) => plan.id === planId)?.discordRoleId;

  if (!roleId) {
    console.log("ロールIDが見つかりませんでした。", planId);
    throw new Error("ロールIDが見つかりませんでした。");
  }

  const url = `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${discordAccountId}/roles/${roleId}`;
  const options = {
    method: "DELETE",
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
  };

  return fetch(url, options)
    .then(async (res) => {
      if (res.ok) {
        console.log("ロールが正常に削除されました。");
      } else {
        console.error(
          "ロール削除時にエラーが発生しました。",
          url,
          await res.json()
        );
      }
    })
    .catch((err) => console.error("リクエスト中にエラーが発生しました：", err));
};

export const removeAllDiscordRoles = async (discordAccountId: string) => {
  for (const plan of PLANS) {
    await removeDiscordRole(discordAccountId, plan.id);
  }
};

export const isDiscordMember = async () => {
  const discordAccount = await getDiscordAccount();

  if (!discordAccount) {
    return false;
  }

  const url = `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${discordAccount.id}`;
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
  };

  try {
    const res = await fetch(url, options);
    return res.ok;
  } catch (err) {
    console.error("Discord APIリクエスト中にエラーが発生しました：", err);
    return false;
  }
};


export const sendDiscordMessage = async (
  channelId: string,
  content: string
) => {
  const url = `https://discord.com/api/v10/channels/${channelId}/messages`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  };

  return fetch(url, options).then(async (res) => {
    if (res.ok) {
      console.log("メッセージが正常に送信されました。");
      const body = await res.json();
      console.log(body);
      return body;
    } else {
      console.error(
        "メッセージ送信時にエラーが発生しました。",
        (await res.json()).message
      );
    }
  });
};

export const joinDiscordGuild = async (userId: string) => {
  const accounts = await getUserAccounts(userId);
  const discordAccount = accounts.find(
    (account) => account.providerId === "discord"
  );
  const discordAccountId = discordAccount?.accountId;

  const { accessToken } = await auth.api.getAccessToken({
    body: {
      providerId: "discord",
      userId,
    },
  });

  const url = `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${discordAccountId}`;
  const options = {
    method: "PUT",
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      access_token: accessToken,
    }),
  };

  await fetch(url, options)
    .then(async (res) => {
      if (res.ok) {
        console.log("Discord guildに正常にjoinしました。");
        return true;
      } else {
        const errorData = await res.json();
        console.error(
          "Discord guild join時にエラーが発生しました。",
          errorData
        );
        return false;
      }
    })
    .catch((err) => {
      console.error(
        "Discord guild joinリクエスト中にエラーが発生しました：",
        err
      );
      return false;
    });
};
