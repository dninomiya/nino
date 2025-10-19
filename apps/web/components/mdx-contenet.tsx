export function MDXContent({ children }: { children: React.ReactNode }) {
  return (
    <article className="prose min-w-0 prose-headings:scroll-mt-[calc(theme(spacing.header)+theme(spacing.8))] mx-auto py-10 xl:py-14 dark:prose-invert prose-neutral">
      {children}
    </article>
  );
}
