import { RegistrySidebar } from "@/app/[locale]/(main)/registry/components/registry-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <RegistrySidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
