import { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/server";
import { getRegistryDocMetas } from "@/lib/registry";
import { CodeProvider } from "@/registry/components/codes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { I18nProvider } from "./i18n-provider";
import { RegistryProvider } from "./registry-provider";
import { ThemeProvider } from "./theme-provider";
import { Suspense } from "react";

export async function Providers({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const registryDocMetas = await getRegistryDocMetas();
  const dictionary = await getDictionary();

  return (
    <I18nProvider locale={locale} dictionary={dictionary}>
      <Suspense>
        <ThemeProvider>
          <CodeProvider>
            <RegistryProvider registryDocMetas={registryDocMetas}>
              <NuqsAdapter>{children}</NuqsAdapter>
            </RegistryProvider>
          </CodeProvider>
        </ThemeProvider>
      </Suspense>
    </I18nProvider>
  );
}
