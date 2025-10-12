import { MDXContent } from "@/components/mdx-contenet";
import { CodeGroupProvider } from "@/components/code-block";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CodeGroupProvider>
      <MDXContent>{children}</MDXContent>
    </CodeGroupProvider>
  );
}
