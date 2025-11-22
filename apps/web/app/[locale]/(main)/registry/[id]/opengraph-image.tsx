import {
  RegistryDocMeta,
  getRegistryDocMeta,
  getRegistryDocMetas,
} from "@/lib/registry";
import { locales } from "@/lib/i18n/locale";
import { generateOpenGraphImage } from "@/components/opengraph-image";
export { size } from "@/components/opengraph-image";

export async function generateStaticParams() {
  const docs = (await getRegistryDocMetas()) as RegistryDocMeta[];
  const params = locales.flatMap((locale) =>
    docs.map((doc) => ({ locale, id: doc.name }))
  );
  return params;
}

export default async function OpenGraphImage({
  params,
}: PageProps<"/[locale]/registry/[id]">) {
  const id = (await params).id;
  const registry = await getRegistryDocMeta(id);
  return generateOpenGraphImage({ title: registry.title });
}
