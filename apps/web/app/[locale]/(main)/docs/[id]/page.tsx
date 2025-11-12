import { CopyButon } from "@/components/copy-markdown-button";
import { HelpBanner } from "@/components/help-banner";
import { MDXContent } from "@/components/mdx-contenet";
import { RecencyDate } from "@/components/recency-date";
import { TableOfContents } from "@/components/table-of-contents";
import { getDocMeta, getDocMetas } from "@/lib/docs";
import {
  getCurrentLocale,
  getMessage,
  setCurrentLocaleFromParams,
} from "@/lib/i18n/server";
import { formatReadingTime } from "@/lib/util";
import { readFileSync } from "fs";
import { ClockFading, RefreshCw } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import path from "path";

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
  const markdownString = readFileSync(
    path.join(process.cwd(), `docs/${id}.mdx`),
    "utf-8"
  );
  const tCommon = await getMessage("Common");
  const locale = getCurrentLocale();

  if (!metadata) {
    notFound();
  }

  return (
    <div className="flex items-start max-w-6xl container gap-10">
      <MDXContent className="flex-1">
        <div className="flex items-center justify-between gap-2 not-prose mb-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold">{metadata.title}</h1>
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
                title={`${tCommon.readingTime}: ${formatReadingTime(post.readingTime.time, locale)}`}
              >
                <ClockFading className="size-3.5" />
                {formatReadingTime(post.readingTime.time, locale)}
              </p>
            </div>
          </div>
          <CopyButon value={markdownString}>{tCommon.copyMarkdown}</CopyButon>
        </div>

        <Content />
        <HelpBanner />
      </MDXContent>
      <aside className="hidden xl:block w-64 sticky top-header h-content px-6 py-10 overflow-auto">
        <TableOfContents />
      </aside>
    </div>
  );
}
