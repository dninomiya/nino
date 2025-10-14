import { RegistrySidebar } from "@/app/[locale]/(main)/registry/components/registry-sidebar";
import { MDXContent } from "@/components/mdx-contenet";
import { TableOfContents } from "@/components/table-of-contents";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";

export const iframeHeight = "800px";

export const description = "A sidebar with a header and a search form.";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="flex flex-col">
      <div className="flex flex-1">
        <RegistrySidebar />
        <SidebarInset className="flex flex-1 flex-row flex-nowrap">
          <div className="flex-1">{children}</div>
          <aside className="hidden xl:block w-64 sticky top-header h-[calc(100svh-theme(spacing.header))] px-6 py-10 overflow-auto">
            <TableOfContents />
          </aside>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
