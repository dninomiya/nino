import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InView } from "react-intersection-observer";
import {
  SiDiscord,
  SiX,
  SiYoutube,
  SiZenn,
} from "@icons-pack/react-simple-icons";
import { AUTHOR_ZENN_URL, X_URL, YOUTUBE_URL } from "@workspace/lib/constants";
import { Logo } from "@workspace/ui/blocks/logo/logo";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@workspace/ui/components/card";
import { ArrowUpRight } from "lucide-react";

export const Skills = () => {
  return (
    <section className="container py-10">
      <h2 className="text-4xl font-bold mb-6">能力</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SkillItem
          title="Webアプリケーションのワンストップ開発"
          description="モダンな技術を使い、1〜数名でWebアプリケーションを開発できます。テックリード、プレイングマネージャー、PM、スクラムマスターとしてプロダクト開発をリードします。"
          className="col-span-2 row-span-2"
          tags={[
            "Eラーニング",
            "マッチング",
            "クラウドソーシング",
            "資料作成ツール",
            "オウンドメディア",
          ]}
        >
          <iframe
            className="size-full block border rounded-md aspect-video bg-muted"
            src="https://embed.figma.com/board/UXSFjMS88G58iDataCPTkG/Architecture?node-id=0-1&embed-host=share"
          ></iframe>
        </SkillItem>
        <SkillItem
          title="技術教育"
          description="長年のメンター経験を活かし、技術者育成が可能です。非技術職のメンバーにAIツールや開発技術を教えることもできます。"
          tags={[
            "社内Eラーニングシステムの構築",
            "動画教材の作成",
            "AIツールの勉強会",
            "技術者の人事評価制度の構築",
          ]}
        ></SkillItem>
        <SkillItem
          title="DX推進"
          description="機動力を活かし、社内の業務効率化ツールを素早く展開できます。あるいは既存ツールをリプレイすることでランニングコストを大きく削減できます。"
          tags={[
            "顧客管理システム",
            "競合調査ダッシュボード",
            "顧客分析ダッシュボード",
            "情報管理ツールの導入、普及",
          ]}
        ></SkillItem>
        <SkillItem
          title="ビジネス駆動"
          description="競合やニーズの動向に合わせて柔軟かつ迅速にMVPの展開やPOCを行います。他社を圧倒するスピードでビジネスを推進します。"
          tags={["POC", "MVP"]}
        ></SkillItem>
        <SkillItem
          title="ブランディング、採用支援"
          description="動画、図解を通した発信を得意とするため、エンジニア組織のブランディングや採用に貢献します。ユーザーと積極的に交流することでプロダクトの信頼性を高め、ユーザー獲得にも貢献します。"
          className="col-span-2"
          contentSide="top"
          tags={[
            "Xでの発信",
            "YouTubeでの動画発信",
            "対外的イベントの開催、登壇",
          ]}
        >
          <div className="flex items-center justify-center aspect-16/5">
            <InView>
              <div className="flex items-center">
                <div className="flex-1 text-center space-y-6">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="font-bold shadow-lg rotate-4"
                  >
                    <a href={X_URL} target="_blank">
                      <SiX /> 4,800人のフォロワー
                      <ArrowUpRight />
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="font-bold shadow-lg -rotate-2"
                  >
                    <a href={AUTHOR_ZENN_URL} target="_blank">
                      <SiZenn /> 技術ブログでの発信
                      <ArrowUpRight />
                    </a>
                  </Button>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 border border-sky-500 animate-ping rounded-full bg-radial to-sky-500" />
                  <Logo
                    className="rounded-full outline-4 outline-offset-1 outline-border"
                    width={120}
                    noLink
                  />
                </div>
                <div className="flex-1 text-center space-y-6">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="font-bold shadow-lg -rotate-4"
                  >
                    <a href={YOUTUBE_URL} target="_blank">
                      <SiYoutube /> YouTube での発信
                      <ArrowUpRight />
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="font-bold shadow-lg rotate-2"
                  >
                    <SiDiscord /> ユーザーコミュニティの運営
                  </Button>
                </div>
              </div>
            </InView>
          </div>
        </SkillItem>
      </div>
    </section>
  );
};

function SkillItem({
  title,
  description,
  children,
  className,
  contentSide,
  tags,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
  tags?: string[];
  contentSide?: "top" | "bottom";
}) {
  return (
    <Card className={className}>
      <CardHeader className="space-y-2 order-1">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
        {tags && (
          <div className="flex flex-wrap gap-2">
            {tags?.map((tag) => (
              <Badge variant="outline" key={tag}>
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      {children && (
        <CardContent
          className={cn(contentSide === "top" ? "order-0" : "order-2")}
        >
          {children}
        </CardContent>
      )}
    </Card>
  );
}
