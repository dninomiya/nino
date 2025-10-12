import { CodeBlockGroupProvider } from "@workspace/registry/blocks/code-block/code-block-proivder";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CodeBlockGroupProvider>
      <div className="prose mx-auto py-10 dark:prose-invert prose-neutral">
        {children}
      </div>
    </CodeBlockGroupProvider>
  );
}
