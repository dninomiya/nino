"use client";

import { DocMeta } from "@/lib/docs";
import { createContext, use } from "react";

const DocContext = createContext<{
  docMetas: DocMeta[];
}>({
  docMetas: [],
});

export function DocProvider({
  children,
  docMetas,
}: {
  children: React.ReactNode;
  docMetas: DocMeta[];
}) {
  return <DocContext value={{ docMetas }}>{children}</DocContext>;
}

export function useDoc() {
  return use(DocContext);
}
