import { RegistrySidebar } from "@/app/[locale]/(main)/registry/components/registry-sidebar";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import { MenuIcon } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
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
