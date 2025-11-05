import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { CodeProvider } from "@/registry/blocks/codes";
import { RegistryProvider } from "./registry-provider";
import { DocProvider } from "./doc-provider";
import { getRegistryDocMetas } from "@/lib/registry";
import { getDocMetas } from "@/lib/docs";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { I18nProvider } from "./i18n-provider";
import { getCurrentLocale, getDictionary } from "@/lib/i18n/server";
import { ThemeProvider } from "./theme-provider";

export async function Providers({ children }: { children: React.ReactNode }) {
  const registryDocMetas = await getRegistryDocMetas();
  const docMetas = await getDocMetas();
  const dictionary = await getDictionary();

  return (
    <I18nProvider locale={getCurrentLocale()} dictionary={dictionary}>
      <ThemeProvider>
        <CodeProvider>
          <RegistryProvider registryDocMetas={registryDocMetas}>
            <DocProvider docMetas={docMetas}>
              <NuqsAdapter>{children}</NuqsAdapter>
            </DocProvider>
          </RegistryProvider>
        </CodeProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
