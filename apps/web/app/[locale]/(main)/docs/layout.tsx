import { DocSidebar } from "@/app/[locale]/(main)/docs/components/doc-sidebar";
import { Footer } from "@/components/footer";
import { docsConfig } from "@/app/[locale]/(main)/docs/docs-config";
import { getDocMetas } from "@/lib/docs";
import { setCurrentLocaleFromParams } from "@/lib/i18n/server";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import { Suspense } from "react";

export default async function Layout({
  children,
  params,
}: LayoutProps<"/[locale]/docs">) {
  await setCurrentLocaleFromParams(params);

  // すべてのドキュメントのメタデータを一度に取得
  const allMetas = await getDocMetas();

  // カテゴリごとにアイテムを生成
  const createItems = (items: string[]) => {
    return items
      .map((itemId) => {
        const meta = allMetas.find((m) => m.id === itemId);
        if (!meta) return null;
        return {
          title: meta.title || itemId,
          url: `/docs/${itemId}`,
          sponsors: meta.sponsors,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  };

  const docItems = {
    gettingStarted: createItems(docsConfig.categories[0]?.items || []),
    guides: createItems(docsConfig.categories[1]?.items || []),
    reference: createItems(docsConfig.categories[2]?.items || []),
  };

  return (
    <SidebarProvider>
      <Suspense
        fallback={
          <div
            className="h-full"
            style={{
              width: "var(--sidebar-width)",
            }}
          />
        }
      >
        <DocSidebar docItems={docItems} />
      </Suspense>
      <SidebarInset>
        <div className="flex items-center text-sm gap-2 p-4 border-b xl:hidden">
          <SidebarTrigger />
          メニュー
        </div>
        {children}
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
