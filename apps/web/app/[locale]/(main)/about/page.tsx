"use cache";

import { setCurrentLocaleFromParams } from "@/lib/i18n/server";

export default async function AboutPage({ params }: PageProps<"/[locale]">) {
  await setCurrentLocaleFromParams(params);
  return <div>About</div>;
}
