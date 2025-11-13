export const metadata = {
  title: "Resume",
};

import { ModeToggle } from "@/components/mode-toggle";
import { RecencyDate } from "@/components/recency-date";
import { setCurrentLocaleFromParams } from "@/lib/i18n/server";

export default async function RedumePage({
  params,
}: PageProps<"/[locale]/resume">) {
  const locale = await setCurrentLocaleFromParams(params);
  const content = (await import(`@/app/[locale]/resume/content.mdx`)) as any;
  const Content = content.default;
  const updatedAt = content.frontmatter?.updatedAt;

  return (
    <article className="prose py-14 prose-neutral container dark:prose-invert">
      <div className="flex items-center justify-end not-prose mb-4">
        <p className="text-sm text-muted-foreground">
          最終更新: <RecencyDate date={updatedAt} locale={locale} />
        </p>
        <div className="fixed right-4 top-4">
          <ModeToggle />
        </div>
      </div>
      <Content />
    </article>
  );
}
