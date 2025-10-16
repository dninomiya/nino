import type { MetadataRoute } from "next";
import { getDocMetas } from "@/lib/docs";
import { getRegistryDocMetas } from "@/lib/registry";
import { baseUrl } from "@workspace/registry/lib/base-url";
import { getPathname } from "@/i18n/navigation";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = baseUrl();
  const locales = ["ja", "en"];

  // 静的ページのパス定義
  const staticPaths = ["/", "/about", "/docs", "/registry"];

  // 多言語対応の静的ページ
  const localizedStaticPages = await Promise.all(
    staticPaths.map(async (path) => {
      const alternates: Record<string, string> = {};

      // 各言語のURLを生成
      for (const locale of locales) {
        alternates[locale] =
          siteUrl +
          (await getPathname({ locale: locale as "ja" | "en", href: path }));
      }

      return {
        url: siteUrl + (await getPathname({ locale: "ja", href: path })),
        lastModified: new Date(),
        changeFrequency:
          path === "/"
            ? ("weekly" as const)
            : path === "/about"
              ? ("monthly" as const)
              : ("weekly" as const),
        priority: path === "/" ? 1 : path === "/about" ? 0.8 : 0.9,
        alternates: {
          languages: alternates,
        },
      };
    })
  );

  // docs の動的ページ
  const docs = await getDocMetas();
  const docsPages = await Promise.all(
    docs.map(async (doc) => {
      const alternates: Record<string, string> = {};

      // 各言語のURLを生成
      for (const locale of locales) {
        alternates[locale] =
          siteUrl +
          (await getPathname({
            locale: locale as "ja" | "en",
            href: `/docs/${doc.id}`,
          }));
      }

      return {
        url:
          siteUrl +
          (await getPathname({ locale: "ja", href: `/docs/${doc.id}` })),
        lastModified: new Date(doc.updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: {
          languages: alternates,
        },
      };
    })
  );

  // registry の動的ページ
  const registryDocs = await getRegistryDocMetas();
  const registryPages = await Promise.all(
    registryDocs.map(async (registry) => {
      const alternates: Record<string, string> = {};

      // 各言語のURLを生成
      for (const locale of locales) {
        alternates[locale] =
          siteUrl +
          (await getPathname({
            locale: locale as "ja" | "en",
            href: `/registry/${registry.name}`,
          }));
      }

      return {
        url:
          siteUrl +
          (await getPathname({
            locale: "ja",
            href: `/registry/${registry.name}`,
          })),
        lastModified: new Date(registry.updatedAt || registry.createdAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: {
          languages: alternates,
        },
      };
    })
  );

  return [...localizedStaticPages, ...docsPages, ...registryPages];
}
