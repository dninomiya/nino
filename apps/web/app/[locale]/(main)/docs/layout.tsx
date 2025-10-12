import { MDXContent } from "@/components/mdx-contenet";
import { CodeProvider } from "@/components/code-block";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CodeProvider>
      <MDXContent>{children}</MDXContent>
    </CodeProvider>
  );
}
