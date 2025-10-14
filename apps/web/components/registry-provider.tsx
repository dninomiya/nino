"use client";

import { RegistryDocMeta } from "@/lib/registry";
import { createContext, use } from "react";

const RegistryContext = createContext<{
  registryDocMetas: RegistryDocMeta[];
}>({
  registryDocMetas: [],
});

export function RegistryProvider({
  children,
  registryDocMetas,
}: {
  children: React.ReactNode;
  registryDocMetas: RegistryDocMeta[];
}) {
  return (
    <RegistryContext value={{ registryDocMetas }}>{children}</RegistryContext>
  );
}

export function useRegistry() {
  return use(RegistryContext);
}
