import { DocMeta, getDocMetas } from "@/lib/docs";
import { locales } from "@/lib/i18n/locale";

export async function generateStaticParams() {
  const docs = (await getDocMetas()) as DocMeta[];
  const params = locales.flatMap((locale) =>
    docs.map((doc) => ({ locale, id: doc.id }))
  );
  return params;
}

export { Image as default, size } from "@/components/opengraph-image";
