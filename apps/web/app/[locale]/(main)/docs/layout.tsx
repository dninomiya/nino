import { MDXContent } from "@/components/mdx-contenet";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MDXContent>{children}</MDXContent>;
}
