import { CopyButon } from "@/components/copy-markdown-button";
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
import {
  getCurrentLocale,
  getMessage,
  setCurrentLocaleFromParams,
} from "@/lib/i18n/server";
import { getRegistryDocMeta, getRegistryDocMetas } from "@/lib/registry";
import { faker } from "@faker-js/faker";
import { isSponsor } from "@workspace/auth";
import { readFileSync } from "fs";
import { Lock, RefreshCw } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import path from "path";
import { Suspense } from "react";

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/registry/[id]">) => {
  const id = (await params).id;
  const registry = await getRegistryDocMeta(id);
  return { title: registry?.title };
};

export const generateStaticParams = async () => {
  const registries = await getRegistryDocMetas();
  return registries.map((registry) => ({ id: registry.name }));
};

export default async function RegistryPage({
  params,
}: PageProps<"/[locale]/registry/[id]">) {
  await setCurrentLocaleFromParams(params);
  const id = (await params).id;
  const post = await import(`@/app/[locale]/(main)/registry/${id}/doc.mdx`);
  const Content = post.default;
  const metadata = post.frontmatter;
  const markdownString = readFileSync(
    path.join(process.cwd(), `app/[locale]/(main)/registry/${id}/doc.mdx`),
    "utf-8"
  );
  const tCommon = await getMessage("Common");

  if (!metadata) {
    notFound();
  }

  if (metadata.sponsors) {
    return (
      <Suspense fallback={<div className="h-content"></div>}>
        <MainContent id={id} metadata={metadata} markdownString={markdownString}>
          <Content />
        </MainContent>
      </Suspense>
    );
  }

  return (
    <MainContent id={id} metadata={metadata} markdownString={markdownString}>
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
              このコンポーネントはスポンサー限定です
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
  markdownString,
  children,
}: {
  id: string;
  metadata: { title: string; createdAt: string; updatedAt?: string; sponsors?: boolean };
  markdownString: string;
  children: React.ReactNode;
}) {
  const tCommon = await getMessage("Common");
  const locale = getCurrentLocale();
  const isSponsorContent = metadata.sponsors;

  return (
    <div className="flex max-w-6xl container gap-10">
      <MDXContent className="flex-1">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2 not-prose">
          <div className="space-y-2">
            <h1 className="text-3xl xl:text-4xl font-bold">{metadata.title}</h1>
            <div className="flex gap-2 flex-wrap">
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
            </div>
          </div>
          <CopyButon value={markdownString}>{tCommon.copyMarkdown}</CopyButon>
        </div>

        {isSponsorContent ? <SponsorOnly>{children}</SponsorOnly> : children}
      </MDXContent>
      <aside className="hidden xl:block w-64 sticky top-header h-[calc(100svh-(var(--spacing-header))-(--spacing(4)))] px-6 py-10 overflow-auto">
        <TableOfContents />
      </aside>
    </div>
  );
}
