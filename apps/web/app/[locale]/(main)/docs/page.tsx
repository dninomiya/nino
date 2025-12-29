import { getDocMetas } from "@/lib/docs";
import {
  getCurrentLocale,
  getMessage,
  setCurrentLocaleFromParams,
} from "@/lib/i18n/server";
import { RecencyDate } from "@/components/recency-date";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import Link from "next/link";

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
  await setCurrentLocaleFromParams(params);
  const t = await getMessage("DocsListPage");
  return {
    title: t.title,
  };
}

export default async function DocsListPage({ params }: PageProps<"/[locale]">) {
  await setCurrentLocaleFromParams(params);
  const docs = await getDocMetas();
  const t = await getMessage("DocsListPage");
  const locale = getCurrentLocale();

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-8">{t.title}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {docs.map((doc) => (
          <Card className="relative" key={doc.id}>
            <CardHeader>
              <CardTitle className="leading-relaxed">
                <Link href={`/docs/${doc.id}`}>
                  {doc.title}
                  <span className="absolute inset-0" />
                </Link>
              </CardTitle>
              <CardDescription className="flex items-center gap-2 flex-wrap">
                <RecencyDate
                  date={doc.updatedAt || doc.createdAt}
                  locale={locale}
                />
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
