"use client";

import { SidebarMenuButton } from "@workspace/ui/components/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarLinkButon({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <SidebarMenuButton asChild isActive={isActive}>
      <Link href={href}>{children}</Link>
    </SidebarMenuButton>
  );
}
