import { Octokit } from "octokit";

export const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

export const inviteUserToOrganization = async (invitee_id: number) => {
  try {
    await octokit.rest.orgs.createInvitation({
      org: "nino-plus",
      invitee_id,
    });
  } catch (error) {
    console.error(error);
  }
};

export const removeUserFromOrganization = async (userId: number) => {
  const githubUser = await getGithubUser(userId);
  const userName = githubUser.data.login;

  if (userName === "dninomiya") {
    return;
  }

  return await octokit.rest.orgs.removeMembershipForUser({
    org: "nino-plus",
    username: githubUser.data.login,
  });
};

const getGithubUser = async (account_id: number) => {
  return octokit.request("GET /user/{account_id}", {
    account_id,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
};

export const isOrgMember = async (userId: number) => {
  const githubUser = await getGithubUser(userId);
  const userName = githubUser.data.login;

  if (userName === "dninomiya") {
    return true;
  }

  return false;
};

export type GithubAccount = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  notification_email: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  private_gists: number;
  total_private_repos: number;
  owned_private_repos: number;
  disk_usage: number;
  collaborators: number;
  two_factor_authentication: boolean;
  plan: {
    name: string;
    space: number;
    collaborators: number;
    private_repos: number;
  };
};
