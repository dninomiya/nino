import { DocMeta, getDocMeta, getDocMetas } from "@/lib/docs";
import { locales } from "@/lib/i18n/locale";
import { generateOpenGraphImage } from "@/components/opengraph-image";

export { size } from "@/components/opengraph-image";

export async function generateStaticParams() {
  const docs = (await getDocMetas()) as DocMeta[];
  const params = locales.flatMap((locale) =>
    docs.map((doc) => ({ locale, id: doc.id }))
  );
  return params;
}

export default async function OpenGraphImage({
  params,
}: PageProps<"/[locale]/docs/[id]">) {
  const id = (await params).id;
  const doc = await getDocMeta(id);
  return generateOpenGraphImage({ title: doc.title });
}
