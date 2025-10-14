import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { baseUrl } from "@workspace/registry/lib/base-url";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { Metadata } from "next";
import { APP_NAME } from "@workspace/lib/constants";
import { setLocale } from "@/i18n/set-locale";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  metadataBase: new URL(baseUrl()),
  description: "Web Developer",
};

export default async function RootLayout({
  params,
  children,
}: LayoutProps<"/[locale]">) {
  const locale = await setLocale(params);

  return (
    <html suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
          <NextIntlClientProvider locale={locale}>
            {children}
          </NextIntlClientProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
