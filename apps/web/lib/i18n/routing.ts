import { NextRequest, NextResponse } from "next/server";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { defaultLocale, Locale, locales } from "./locale";

export function handleLocaleRouting(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname;

  const hasLocale = locales.some((locale) => pathname.startsWith(`/${locale}`));

  if (hasLocale) {
    const trimReg = new RegExp(`^/(${locales.join("|")})`);
    const trimmedPathname = pathname.replace(trimReg, "");
    const targetLocale = pathname.match(trimReg)?.[0]?.slice(1);

    const response = NextResponse.redirect(
      new URL(trimmedPathname || "/", request.url)
    );
    response.cookies.set("locale", targetLocale || defaultLocale);
    return response;
  }

  const cookieLocale = request.cookies.get("locale")?.value;
  const negotiator = new Negotiator({
    headers: {
      "accept-language": request.headers.get("accept-language") || "",
    },
  });
  const languages = negotiator.languages();

  const locale = locales.includes(cookieLocale as Locale)
    ? cookieLocale
    : match(languages, locales, defaultLocale);

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.rewrite(url);
}

