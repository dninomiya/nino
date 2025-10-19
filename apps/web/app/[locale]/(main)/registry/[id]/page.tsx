import { CopyButon } from "@/components/copy-markdown-button";
import { MDXContent } from "@/components/mdx-contenet";
import { TableOfContents } from "@/components/table-of-contents";
import { getRegistryDocMeta, getRegistryDocMetas } from "@/lib/registry";
import { formatDateByRecency } from "@/lib/util";
import { readFileSync } from "fs";
import { RefreshCw } from "lucide-react";
import { notFound } from "next/navigation";
import path from "path";
import { getTranslations } from "next-intl/server";

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
  const id = (await params).id;
  const post = await import(`@/app/[locale]/(main)/registry/${id}/doc.mdx`);
  const Content = post.default;
  const metadata = post.frontmatter;
  const markdownString = readFileSync(
    path.join(process.cwd(), `app/[locale]/(main)/registry/${id}/doc.mdx`),
    "utf-8"
  );
  const t = await getTranslations("RegistryDetailPage");
  const tCommon = await getTranslations("Common");

  if (!metadata) {
    notFound();
  }

  return (
    <div className="flex px-4">
      <MDXContent>
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2 not-prose">
          <div className="space-y-2">
            <h1 className="text-3xl xl:text-4xl font-bold">{metadata.title}</h1>
            <div className="flex gap-1 flex-wrap">
              <p
                className="text-muted-foreground text-sm flex items-center gap-1.5"
                title={t("createdAt", { date: metadata.createdAt })}
              >
                {formatDateByRecency(metadata.createdAt)}
              </p>
              ・
              <p
                className="text-muted-foreground text-sm flex items-center gap-1.5"
                title={t("updatedAt", { date: metadata.updatedAt })}
              >
                <RefreshCw className="size-3.5" />
                {formatDateByRecency(metadata.updatedAt)}
              </p>
            </div>
          </div>
          <CopyButon value={markdownString}>
            {tCommon("copyMarkdown")}
          </CopyButon>
        </div>

        <Content />
      </MDXContent>
      <aside className="hidden xl:block w-64 sticky top-header h-[calc(100svh-theme(spacing.header)-theme(spacing.4))] px-6 py-10 overflow-auto">
        <TableOfContents />
      </aside>
    </div>
  );
}
