"use cache";

import { RegistrySidebar } from "@/app/[locale]/(main)/registry/components/registry-sidebar";
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
}: LayoutProps<"/[locale]/registry/[id]">) {
  await setCurrentLocaleFromParams(params);

  return (
    <SidebarProvider>
      <RegistrySidebar />
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
