"use cache";

import { getDocMetas } from "@/lib/docs";
import {
  getCurrentLocale,
  getMessage,
  setCurrentLocaleFromParams,
} from "@/lib/i18n/server";
import { formatDateByRecency } from "@/lib/util";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import Link from "next/link";

export const metadata = {
  title: "Docs",
};

export default async function DocsListPage({ params }: PageProps<"/[locale]">) {
  await setCurrentLocaleFromParams(params);
  const docs = await getDocMetas();
  const t = await getMessage("DocsListPage");
  const locale = getCurrentLocale();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">{t.title}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {docs.map((doc) => (
          <Link key={doc.id} href={`/docs/${doc.id}`}>
            <Card>
              <CardHeader>
                <CardTitle>{doc.title}</CardTitle>
                <CardDescription>
                  {formatDateByRecency(doc.updatedAt || doc.createdAt, locale)}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
