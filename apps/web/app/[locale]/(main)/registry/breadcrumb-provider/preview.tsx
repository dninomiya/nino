"use client";

import {
  BreadcrumbProvider,
  BreadcrumbConfig,
  MainBreadCrumb,
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
      <MainBreadCrumb />
    </BreadcrumbProvider>
  );
}

