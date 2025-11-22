import { RegistryDocMeta, getRegistryDocMetas } from "@/lib/registry";
import { locales } from "@/lib/i18n/locale";

export async function generateStaticParams() {
  const docs = (await getRegistryDocMetas()) as RegistryDocMeta[];
  const params = locales.flatMap((locale) =>
    docs.map((doc) => ({ locale, id: doc.name }))
  );
  return params;
}

export { Image as default, size } from "@/components/opengraph-image";
