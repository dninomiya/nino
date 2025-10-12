import { MDXContent } from "@/components/mdx-contenet";
import { getRegistry } from "@/lib/registry";
import { Button } from "@workspace/ui/components/button";
import { Copy } from "lucide-react";
import { notFound } from "next/navigation";

export default async function RegistryPage({
  params,
}: PageProps<"/[locale]/registry/[id]">) {
  const id = (await params).id;
  const post = await import(`@/app/[locale]/(main)/registry/docs/${id}.mdx`);
  const Content = post.default;
  const registry = getRegistry(id);

  if (!registry) {
    notFound();
  }

  return (
    <MDXContent>
      <div className="flex items-center justify-between gap-2 not-prose">
        <h1 className="text-3xl font-bold">{registry.title}</h1>
        <Button variant="outline">
          <Copy />
          マークダウンをコピー
        </Button>
      </div>

      <Content />
    </MDXContent>
  );
}
