import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { CodeProvider } from "@/registry/blocks/codes";
import { RegistryProvider } from "./registry-provider";
import { getRegistryDocMetas } from "@/lib/registry";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { I18nProvider } from "./i18n-provider";
import { getCurrentLocale, getDictionary } from "@/lib/i18n/server";

export async function Providers({ children }: { children: React.ReactNode }) {
  const registryDocMetas = await getRegistryDocMetas();
  const dictionary = await getDictionary();

  return (
    <I18nProvider locale={getCurrentLocale()} dictionary={dictionary}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <CodeProvider>
          <RegistryProvider registryDocMetas={registryDocMetas}>
            <NuqsAdapter>{children}</NuqsAdapter>
          </RegistryProvider>
        </CodeProvider>
      </NextThemesProvider>
    </I18nProvider>
  );
}
