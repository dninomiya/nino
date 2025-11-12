"use client";

import { SidebarMenuButton } from "@workspace/ui/components/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarLinkButon({
  prefetch = false,
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <SidebarMenuButton asChild isActive={isActive} className={className}>
      <Link href={href} prefetch={prefetch}>
        {children}
      </Link>
    </SidebarMenuButton>
  );
}
