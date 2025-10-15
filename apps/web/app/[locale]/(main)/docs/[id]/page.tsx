import { CopyButon } from "@/components/copy-markdown-button";
import { MDXContent } from "@/components/mdx-contenet";
import { TableOfContents } from "@/components/table-of-contents";
import { getDocMeta, getDocMetas } from "@/lib/docs";
import { formatDateByRecency, formatReadingTime } from "@/lib/util";
import { readFileSync } from "fs";
import { ClockFading, RefreshCw } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import path from "path";

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/docs/[id]">) => {
  const { id, locale } = await params;
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
  const id = (await params).id;
  const post = await import(`@/docs/${id}.mdx`);
  const Content = post.default;
  const metadata = post.frontmatter;
  const markdownString = readFileSync(
    path.join(process.cwd(), `docs/${id}.mdx`),
    "utf-8"
  );

  if (!metadata) {
    notFound();
  }

  return (
    <div>
      <MDXContent>
        <div className="flex items-center justify-between gap-2 not-prose">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">{metadata.title}</h1>
            <div className="flex gap-1 flex-wrap">
              <p
                className="text-muted-foreground text-sm flex items-center gap-1.5"
                title={`作成日: ${metadata.createdAt}`}
              >
                {formatDateByRecency(metadata.createdAt)}
              </p>
              ・
              <p
                className="text-muted-foreground text-sm flex items-center gap-1.5"
                title={`更新日: ${metadata.updatedAt}`}
              >
                <RefreshCw className="size-3.5" />
                {formatDateByRecency(metadata.updatedAt)}
              </p>
              ・
              <p
                className="text-muted-foreground text-sm flex items-center gap-1.5"
                title={`読了目安: ${formatReadingTime(post.readingTime.time)}`}
              >
                <ClockFading className="size-3.5" />
                {formatReadingTime(post.readingTime.time)}
              </p>
            </div>
          </div>
          <CopyButon value={markdownString}>マークダウンをコピー</CopyButon>
        </div>

        <Content />
      </MDXContent>
      <aside className="hidden xl:block w-64 sticky top-header h-[calc(100svh-theme(spacing.header)-theme(spacing.4))] px-6 py-10 overflow-auto">
        <TableOfContents />
      </aside>
    </div>
  );
}
