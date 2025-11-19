export const metadata = {
  title: "Resume",
};

import { ModeToggle } from "@/components/mode-toggle";
import { RecencyDate } from "@/components/recency-date";
import { Badge } from "@/components/ui/badge";
import { setCurrentLocaleFromParams } from "@/lib/i18n/server";

export default async function RedumePage({
  params,
}: PageProps<"/[locale]/resume/[[...type]]">) {
  const locale = await setCurrentLocaleFromParams(params);
  const type = (await params).type;
  const content = (await import(
    `@/app/[locale]/resume/contents/${type ?? "default"}.mdx`
  )) as any;
  const Content = content.default;
  const updatedAt = content.frontmatter?.updatedAt;
  const active = content.frontmatter?.active;

  return (
    <article className="prose print:prose-sm not-print:pt-14 not-print:pb-32 prose-neutral mx-auto not-print:px-6 dark:prose-invert">
      <div className="flex items-center justify-end not-prose mb-4 gap-3 print:hidden">
        {active ? (
          <Badge>求職中</Badge>
        ) : (
          <p className="text-sm text-muted-foreground">
            積極的な求職活動は行なっていません。
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          最終更新: <RecencyDate date={updatedAt} locale={locale} />
        </p>
        <div className="fixed right-4 top-4 print:hidden">
          <ModeToggle />
        </div>
      </div>
      <Content />
    </article>
  );
}
