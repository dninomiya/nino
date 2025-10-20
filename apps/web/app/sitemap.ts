export const dynamic = "force-static";

import { getDocMetas } from "@/lib/docs";
import { locales } from "@/lib/i18n/locale";
import { getRegistryDocMetas } from "@/lib/registry";
import { baseUrl } from "@/registry/lib/base-url";
import type { MetadataRoute } from "next";

type SitemapPath = {
  path: string;
  lastModified: Date;
  changeFrequency: "monthly" | "weekly" | "daily" | "hourly" | "never";
  priority: number;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseURL = baseUrl();
  const staticPaths: SitemapPath[] = [
    {
      path: "/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      path: "/docs",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      path: "/registry",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      path: "/profile",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Promise.allで並列実行
  const [docMetas, registryDocMetas] = await Promise.all([
    getDocMetas(),
    getRegistryDocMetas(),
  ]);

  const docPaths = docMetas.map(
    (doc) =>
      ({
        path: `/docs/${doc.id}`,
        lastModified: new Date(doc.updatedAt),
        changeFrequency: "monthly",
        priority: 0.8,
      }) satisfies SitemapPath
  );
  const registryPaths = registryDocMetas.map(
    (doc) =>
      ({
        path: `/registry/${doc.name}`,
        lastModified: new Date(doc.updatedAt),
        changeFrequency: "monthly",
        priority: 0.8,
      }) satisfies SitemapPath
  );

  const allItems = [...staticPaths, ...docPaths, ...registryPaths];

  return locales.flatMap((locale) =>
    allItems.map((item) => ({
      url: new URL(`/${locale}/${item.path}`, baseURL).toString(),
      ...item,
    }))
  );
}
