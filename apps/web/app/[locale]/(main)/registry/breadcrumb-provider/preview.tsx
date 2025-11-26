"use client";

import {
  BreadcrumbProvider,
  BreadcrumbConfig,
  BreadcrumbMain,
} from "@/registry/components/breadcrumb-provider";

export default function Preview() {
  return (
    <BreadcrumbProvider>
      <BreadcrumbConfig
        items={[
          { label: "ホーム", href: "/" },
          { label: "ドキュメント", href: "/docs" },
          { label: "ガイド" },
        ]}
      />
      <BreadcrumbMain />
    </BreadcrumbProvider>
  );
}
