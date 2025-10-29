import { CopyButon } from "@/components/copy-markdown-button";
import { MDXContent } from "@/components/mdx-contenet";
import { RecencyDate } from "@/components/recency-date";
import { TableOfContents } from "@/components/table-of-contents";
import {
  getCurrentLocale,
  getMessage,
  setCurrentLocaleFromParams,
} from "@/lib/i18n/server";
import { getRegistryDocMeta, getRegistryDocMetas } from "@/lib/registry";
import { readFileSync } from "fs";
import { RefreshCw } from "lucide-react";
import { notFound } from "next/navigation";
import path from "path";

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

  const locale = getCurrentLocale();

  return (
    <div className="flex max-w-6xl container gap-10">
      <MDXContent className="flex-1">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2 not-prose">
          <div className="space-y-2">
            <h1 className="text-3xl xl:text-4xl font-bold">{metadata.title}</h1>
            <div className="flex gap-1 flex-wrap">
              <p
                className="text-muted-foreground text-sm flex items-center gap-1.5"
                title={`${tCommon.createdAt}: ${metadata.createdAt}`}
              >
                <RecencyDate date={metadata.createdAt} locale={locale} />
              </p>
              ・
              <p
                className="text-muted-foreground text-sm flex items-center gap-1.5"
                title={`${tCommon.updatedAt}: ${metadata.updatedAt}`}
              >
                <RefreshCw className="size-3.5" />
                <RecencyDate date={metadata.updatedAt} locale={locale} />
              </p>
            </div>
          </div>
          <CopyButon value={markdownString}>{tCommon.copyMarkdown}</CopyButon>
        </div>

        <Content />
      </MDXContent>
      <aside className="hidden xl:block w-64 sticky top-header h-[calc(100svh-(var(--spacing-header))-(--spacing(4)))] px-6 py-10 overflow-auto">
        <TableOfContents />
      </aside>
    </div>
  );
}
