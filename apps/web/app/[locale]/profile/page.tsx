import { ModeToggle } from "@/components/mode-toggle";
import {
  SiApple,
  SiGithub,
  SiNotion,
  SiSlack,
} from "@icons-pack/react-simple-icons";
import { TECHNOLOGIES } from "@workspace/lib/technologies";
import { Logo } from "@workspace/ui/blocks/logo/logo";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { setCurrentLocaleFromParams } from "@/lib/i18n/server";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { ArrowLeft, FlaskConical, Home, Users2 } from "lucide-react";
import Link from "next/link";

const MAX_PERFORMANCE_ENVIRONMENT = [
  {
    icon: Home,
    title: "フルリモート",
    description: "要介護の家族がいるため",
  },
  {
    icon: SiApple,
    title: "Mac",
    description: "英字キーボーだと嬉しい",
  },
  {
    icon: SiNotion,
    title: "Notion",
    description: "ドキュメント、タスク管理",
  },
  {
    icon: SiGithub,
    title: "GitHub",
    description: "重たいオンプレGitLabは避けたい",
  },
  {
    icon: Users2,
    title: "スクラム開発",
    description: "スクラムマスターできます",
  },
  {
    icon: SiSlack,
    title: "Slack",
    description: "not Teams",
  },
];

const positions = [
  {
    title: "テックリード",
    description: "テックリードできます",
  },
  {
    title: "PM",
    description: "PMできます",
  },
  {
    title: "スクラムマスター",
    description: "スクラムマスターできます",
  },
];

export default async function ProfilePage({ params }: PageProps<"/[locale]">) {
  await setCurrentLocaleFromParams(params);

  return (
    <div className="container max-w-3xl py-10 space-y-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft />
            戻る
          </Link>
        </Button>
        <span className="flex-1"></span>
        <ModeToggle />
        <p className="text-sm text-muted-foreground text-right">
          最終更新:{" "}
          {formatDistanceToNow(new Date(), { addSuffix: true, locale: ja })}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Logo width={48} height={48} />
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold">Daichi Ninomiya</h1>
            <p className="text-sm text-muted-foreground">Web Developer</p>
          </div>
        </div>

        <p className="leading-relaxed">
          スピードと品質でライバルを圧倒し、業界内で絶対的な地位を確立します。Webアプリのローンチや継続的なアップデートを一任してください。
        </p>
      </div>

      <section className="grid grid-cols-3 gap-4">
        <div className="aspect-video border rounded-xl" />
        <div className="aspect-video border rounded-xl" />
        <div className="aspect-video border rounded-xl" />
      </section>

      <section className="space-y-4">
        <h2>適正ポジション</h2>
        <div className="flex flex-wrap gap-2">
          {positions.map((position) => (
            <Badge variant="outline" key={position.title}>
              {position.title}
            </Badge>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2>モダンな開発技術に精通</h2>
        <div className="flex flex-wrap gap-2">
          {Object.values(TECHNOLOGIES).map((technology) => (
            <Tooltip key={technology.title}>
              <TooltipTrigger asChild>
                <Badge variant="outline" key={technology.title}>
                  <technology.icon />
                  {technology.title}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>{technology.description}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2>パフォーマンスが最大化する環境</h2>

        <div className="flex flex-wrap gap-2">
          {MAX_PERFORMANCE_ENVIRONMENT.map((environment) => (
            <Tooltip key={environment.title}>
              <TooltipTrigger asChild>
                <Badge variant="outline" key={environment.title}>
                  <environment.icon />
                  {environment.title}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>{environment.description}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </section>
    </div>
  );
}
