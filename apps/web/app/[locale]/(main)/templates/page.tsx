"use cache";

import { setCurrentLocaleFromParams } from "@/lib/i18n/server";

export default async function TemplatesPage({
  params,
}: PageProps<"/[locale]">) {
  await setCurrentLocaleFromParams(params);
  return <div className="bg-[#f5f5f5]">TemplatesPage</div>;
}
