import { CopyButon } from "@/components/copy-markdown-button";
import { HelpBanner } from "@/components/help-banner";
import { MDXContent } from "@/components/mdx-contenet";
import { RecencyDate } from "@/components/recency-date";
import { TableOfContents } from "@/components/table-of-contents";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DocMeta, getDocMeta, getDocMetas } from "@/lib/docs";
import {
  getCurrentLocale,
  getMessage,
  setCurrentLocaleFromParams,
} from "@/lib/i18n/server";
import { formatReadingTime } from "@/lib/util";
import { faker } from "@faker-js/faker";
import { isSponsor } from "@workspace/auth";
import { readFileSync } from "fs";
import { ClockFading, Lock, RefreshCw } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import path from "path";
import { Suspense } from "react";

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/docs/[id]">) => {
  const { id } = await params;
  const doc = await getDocMeta(id);
  return {
    title: doc?.title,
  } satisfies Metadata;
};

export const generateStaticParams = async () => {
  const docs = await getDocMetas();
  return docs.map((doc) => ({ id: doc.id }));
};

export default async function DocsPage({
  params,
}: PageProps<"/[locale]/docs/[id]">) {
  await setCurrentLocaleFromParams(params);
  const id = (await params).id;
  const post = await import(`@/docs/${id}.mdx`);
  const Content = post.default;
  const metadata = post.frontmatter;
  const readingTime = post.readingTime.time;

  if (!metadata) {
    notFound();
  }

  if (metadata.sponsors) {
    return (
      <Suspense fallback={<div className="h-content"></div>}>
        <MainContent id={id} metadata={metadata} readingTime={readingTime}>
          <Content />
        </MainContent>
      </Suspense>
    );
  }

  return (
    <MainContent id={id} metadata={metadata} readingTime={readingTime}>
      <Content />
    </MainContent>
  );
}

async function SponsorOnly({ children }: { children: React.ReactNode }) {
  // TODO: ローカルサーバーで謎のエラーが出るバグが解消したら復活
  // "use cache: private";
  // cacheLife({
  //   stale: Number.MAX_VALUE,
  // });
  const sponsor = await isSponsor();

  if (!sponsor) {
    return (
      <div className="grid place-content-center relative">
        <div className="blur select-none">
          <p>{faker.lorem.paragraphs(3)}</p>
          <p>{faker.lorem.paragraphs(3)}</p>
          <p>{faker.lorem.paragraphs(3)}</p>
        </div>
        <Card className="absolute top-20 left-1/2 -translate-x-1/2 z-10 w-[80%] not-prose">
          <CardHeader>
            <Lock className="mb-2" />
            <CardTitle>スポンサー限定</CardTitle>
            <CardDescription>
              このドキュメントはスポンサー限定です
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/sponsors">
                <span>スポンサーになる</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return children;
}

async function MainContent({
  id,
  metadata,
  readingTime,
  children,
}: {
  id: string;
  metadata: DocMeta;
  readingTime: number;
  children: React.ReactNode;
}) {
  const markdownString = readFileSync(
    path.join(process.cwd(), `docs/${id}.mdx`),
    "utf-8"
  );
  const tCommon = await getMessage("Common");
  const locale = getCurrentLocale();
  const isSponsorConent = metadata.sponsors;

  return (
    <div className="flex items-start max-w-6xl container gap-10">
      <MDXContent className="flex-1">
        <div className="not-prose mb-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-normal">
              {metadata.title}
            </h1>
            <div className="flex gap-4 flex-wrap">
              <p
                className="text-muted-foreground text-sm flex items-center gap-1.5"
                title={`${tCommon.createdAt}: ${metadata.createdAt}`}
              >
                <RecencyDate date={metadata.createdAt} locale={locale} />
              </p>
              {metadata.updatedAt && (
                <p
                  className="text-muted-foreground text-sm flex items-center gap-1.5"
                  title={`${tCommon.updatedAt}: ${metadata.updatedAt}`}
                >
                  <RefreshCw className="size-3.5" />
                  <RecencyDate date={metadata.updatedAt} locale={locale} />
                </p>
              )}
              <p
                className="text-muted-foreground text-sm flex items-center gap-1.5"
                title={`${tCommon.readingTime}: ${formatReadingTime(readingTime, locale)}`}
              >
                <ClockFading className="size-3.5" />
                {formatReadingTime(readingTime, locale)}
              </p>
              <span className="flex-1 hidden xl:block" />
              <CopyButon value={markdownString}>
                {tCommon.copyMarkdown}
              </CopyButon>
            </div>
          </div>
        </div>

        {isSponsorConent ? <SponsorOnly>{children}</SponsorOnly> : children}

        <div className="mt-20">
          <HelpBanner />
        </div>
      </MDXContent>
      <aside className="hidden xl:block w-64 sticky top-header h-content px-6 py-10 overflow-auto">
        <TableOfContents />
      </aside>
    </div>
  );
}
