import { cn } from "@/lib/utils";

export function MDXContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "prose min-w-0 max-w-none prose-headings:scroll-mt-[calc(var(--spacing-header)+(--spacing(6)))] py-10 xl:py-14 dark:prose-invert prose-neutral",
        className
      )}
    >
      {children}
    </article>
  );
}
