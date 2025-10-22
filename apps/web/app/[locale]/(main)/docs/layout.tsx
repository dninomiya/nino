import { DocSidebar } from "@/app/[locale]/(main)/docs/components/doc-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import { setCurrentLocaleFromParams } from "@/lib/i18n/server";
import { Footer } from "@/components/footer";

export default async function Layout({
  children,
  params,
}: LayoutProps<"/[locale]/docs">) {
  await setCurrentLocaleFromParams(params);

  return (
    <SidebarProvider>
      <DocSidebar />
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
