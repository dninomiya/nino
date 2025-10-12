import { MDXContent } from "@/components/mdx-contenet";
import { CodeBlockGroupProvider } from "@workspace/registry/blocks/code-block/code-block";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CodeBlockGroupProvider>
      <MDXContent>{children}</MDXContent>
    </CodeBlockGroupProvider>
  );
}
