import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Logo } from "@workspace/ui/blocks/logo/logo";

export default function ExamplesLayout({
  children,
  source,
}: {
  children: React.ReactNode;
  source: React.ReactNode;
}) {
  return (
    <SidebarProvider className="[--sidebar-width:720px]!">
      <Sidebar>{source}</Sidebar>
      <SidebarInset>
        <header className="flex bg-background items-center gap-2 h-12 px-2 border-b shrink-0 sticky top-0">
          <SidebarTrigger />
          <Logo width={28} height={28} />
        </header>
        <main className="h-full overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
