import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

export const setLocale = async (
  params: Promise<{
    locale: string;
  }>
) => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return locale;
};
