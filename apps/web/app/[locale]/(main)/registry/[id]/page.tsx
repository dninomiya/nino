import { CopyButon } from "@/components/copy-markdown-button";
import { MDXContent } from "@/components/mdx-contenet";
import { getRegistryDocMeta } from "@/lib/registry";
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

  console.log(post);

  if (!metadata) {
    notFound();
  }

  return (
    <MDXContent>
      <div className="flex items-center justify-between gap-2 not-prose">
        <h1 className="text-4xl font-bold">{metadata.title}</h1>
        <CopyButon value={markdownString}>マークダウンをコピー</CopyButon>
      </div>

      <Content />
    </MDXContent>
  );
}
