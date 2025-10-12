export function MDXContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose mx-auto py-14 dark:prose-invert prose-neutral">
      {children}
    </div>
  );
}
