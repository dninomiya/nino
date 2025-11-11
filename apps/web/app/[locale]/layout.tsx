import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";

import { Providers } from "@/components/providers";
import { locales } from "@/lib/i18n/locale";
import { setCurrentLocaleFromParams } from "@/lib/i18n/server";
import { Toaster } from "@workspace/ui/components/sonner";
import "@workspace/ui/globals.css";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  params,
  children,
}: LayoutProps<"/[locale]">) {
  const locale = (await params).locale;
  await setCurrentLocaleFromParams(params);

  return (
    <html lang={locale} suppressHydrationWarning>
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
