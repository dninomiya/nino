export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="prose mx-auto py-10 dark:prose-invert prose-neutral">
      {children}
    </div>
  );
}
