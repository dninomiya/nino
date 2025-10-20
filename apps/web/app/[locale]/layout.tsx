import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { baseUrl } from "@/registry/lib/base-url";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { Metadata } from "next";
import { APP_NAME } from "@workspace/lib/constants";
import { Toaster } from "@workspace/ui/components/sonner";
import { locales } from "@/lib/i18n/locale";
import { setCurrentLocale } from "@/lib/i18n/server";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
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
  const locale = (await params).locale;
  console.log(locale, "layout");
  setCurrentLocale(locale);

  return (
    <html suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>{children}</Providers>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
