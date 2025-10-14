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
    <SidebarProvider>
      <RegistrySidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
