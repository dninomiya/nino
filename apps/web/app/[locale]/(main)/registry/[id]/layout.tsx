import { RegistrySidebar } from "@/app/[locale]/(main)/registry/components/registry-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";

export default async function Layout({
  children,
}: LayoutProps<"/[locale]/registry/[id]">) {
  return (
    <SidebarProvider>
      <RegistrySidebar />
      <SidebarInset>
        <div className="flex items-center text-sm gap-2 p-4 border-b xl:hidden">
          <SidebarTrigger />
          メニュー
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
