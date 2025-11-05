import { Button } from "@/components/ui/button";
import { SiDiscord, SiGithub } from "@icons-pack/react-simple-icons";
import { getGithubAccount } from "@workspace/auth";
import {
  linkGithub,
  syncDiscordRole,
  unlinkGitHub,
} from "@workspace/auth/action";
import { hasDiscordRole, isDiscordMember } from "@workspace/auth/discord";
import { getMyOrganizationUserInfo } from "@workspace/auth/github";
import {
  DISCORD_URL,
  GITHUB_ORG_INVITATION_URL,
  GITHUB_ORG_URL,
} from "@workspace/lib/constants";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default async function IntegrationMenu() {
  const is_discord_member = await isDiscordMember();
  const has_discord_role = await hasDiscordRole();
  const orgMemberInfo = await getMyOrganizationUserInfo();
  const githubAccount = await getGithubAccount();

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">アカウント連携</h2>

      <div className="border rounded-lg divide-y">
        <MemberServiceCard
          title="Discord チャンネル"
          description="有料メンバー限定の Discord チャンネルに参加できます。"
          icon={<SiDiscord color="default" />}
        >
          {is_discord_member && (
            <>
              {has_discord_role ? (
                <Button variant="outline" asChild>
                  <Link href={DISCORD_URL} target="_blank">
                    アクセス
                    <ArrowUpRight />
                  </Link>
                </Button>
              ) : (
                <form action={syncDiscordRole}>
                  <Button variant="outline">権限を連携</Button>
                </form>
              )}
            </>
          )}

          {!is_discord_member && (
            <Button variant="outline" asChild>
              <Link href={DISCORD_URL} target="_blank">
                コミュニティに参加
                <ArrowUpRight />
              </Link>
            </Button>
          )}
        </MemberServiceCard>

        <MemberServiceCard
          title="GitHub リソース"
          description="有料メンバー限定のテンプレートリポジトリにアクセスできます。"
          icon={<SiGithub />}
        >
          {githubAccount && (
            <div className="flex gap-2">
              {orgMemberInfo?.data.state === "active" && (
                <Button variant="outline" asChild>
                  <Link href={GITHUB_ORG_URL} target="_blank">
                    アクセス
                    <ArrowUpRight />
                  </Link>
                </Button>
              )}

              {orgMemberInfo?.data.state === "pending" && (
                <Button asChild>
                  <Link href={GITHUB_ORG_INVITATION_URL} target="_blank">
                    招待を承認
                    <ArrowUpRight />
                  </Link>
                </Button>
              )}

              {!orgMemberInfo && <Button variant="outline">招待申請</Button>}

              <Button variant="ghost" onClick={unlinkGitHub}>
                連携解除
              </Button>
            </div>
          )}

          {!githubAccount && <Button onClick={linkGithub}>連携</Button>}
        </MemberServiceCard>
      </div>
    </div>
  );
}

function MemberServiceCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row px-6 md:px-0 relative items-center py-6 overflow-hidden">
      <div className="w-40 flex justify-center mb-6 md:mb-0">
        <div className="*:size-13">{icon}</div>
      </div>
      <div className="flex-1 space-y-4 pr-10">
        <h2 className="text-lg leading-none font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex gap-2">{children}</div>
      </div>
    </div>
  );
}
