import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMessage, setCurrentLocaleFromParams } from "@/lib/i18n/server";
import { SiDiscord, SiGithub } from "@icons-pack/react-simple-icons";
import { File, MessageCircleQuestionIcon, VideoIcon } from "lucide-react";
import { CTA } from "./components/cta";
import { Suspense } from "react";

export default async function SponsorsPage({
  params,
}: PageProps<"/[locale]/sponsors">) {
  await setCurrentLocaleFromParams(params);
  const t = await getMessage("SponsorsPage");

  return (
    <div className="container py-10">
      <section className="py-10 space-y-4">
        <h1 className="text-4xl font-bold">{t.title}</h1>
        <p>発信や活動を支えてくれるスポンサーを募集しています。</p>
      </section>

      <section className="py-10 space-y-4">
        <h2 className="text-3xl font-bold">スポンサー特典</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <File />
              <CardTitle>スポンサー限定ドキュメントの閲覧</CardTitle>
            </CardHeader>
            <CardContent>
              <p>すべてのドキュメントを閲覧できます。</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <SiGithub />
              <CardTitle>限定コードの参照</CardTitle>
            </CardHeader>
            <CardContent>
              <p>スポンサーはすべてのソースコードを参照できます。</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <SiDiscord />
              <CardTitle>スポンサー限定コミュニティへの参加</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Discordのスポンサー限定チャンネルに参加できます。</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <VideoIcon />
              <CardTitle>勉強会、交流会への参加</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                毎週土曜に開催されるオンライン勉強会、交流会に参加できます。
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <MessageCircleQuestionIcon />
              <CardTitle>技術的な質問、相談が可能</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Discordで技術的な質問、相談ができます。</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Suspense>
        <CTA />
      </Suspense>

      <section className="py-10 space-y-4">
        <h2 className="text-3xl font-bold">FAQ</h2>

        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-1"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>返金はありますか？</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>返金はありません。あらかじめご了承ください。</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>支払い方法は何ですか？</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>クレジットカードのみとなります。</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
