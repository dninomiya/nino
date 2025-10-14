import { CopyButon } from "@/components/copy-markdown-button";
import { MDXContent } from "@/components/mdx-contenet";
import { TableOfContents } from "@/components/table-of-contents";
import { getRegistryDocMeta, getRegistryDocMetas } from "@/lib/registry";
import { readFileSync } from "fs";
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
  const id = (await params).id;
  const post = await import(`@/app/[locale]/(main)/registry/${id}/doc.mdx`);
  const Content = post.default;
  const metadata = post.frontmatter;
  const markdownString = readFileSync(
    path.join(process.cwd(), `app/[locale]/(main)/registry/${id}/doc.mdx`),
    "utf-8"
  );

  if (!metadata) {
    notFound();
  }

  return (
    <div className="flex">
      <MDXContent>
        <div className="flex items-center justify-between gap-2 not-prose">
          <h1 className="text-4xl font-bold">{metadata.title}</h1>
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
