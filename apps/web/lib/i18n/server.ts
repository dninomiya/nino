import "server-only";

import {
  MessagesSchema,
  NestedKeyOfMessages,
  NestedValueOfMessages,
} from "@/types/message";
import { cache } from "react";
import { defaultLocale, Locale, locales } from "./locale";
import {
  getMessageWithFallback as getMessageWithFallbackUtil,
  getNestedValue,
} from "./utils";

let _currentLocale: Locale = defaultLocale;

export const setCurrentLocale = (locale: string) => {
  if (!locales.includes(locale as Locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  _currentLocale = locale as Locale;
};

/**
 * paramsからlocaleを取得して設定する共通関数
 */
export const setCurrentLocaleFromParams = async (
  params: Promise<{ locale: string }>
) => {
  const { locale } = await params;
  setCurrentLocale(locale);
};

export const getCurrentLocale = cache(() => {
  return _currentLocale || defaultLocale;
});

export const getDictionary = async (): Promise<MessagesSchema> => {
  const locale = getCurrentLocale();
  const messages = await import(`../../messages/${locale}.ts`);
  return messages.default;
};

export const getMessage = async <K extends NestedKeyOfMessages>(
  key: K
): Promise<NestedValueOfMessages<K>> => {
  const dictionary = await getDictionary();
  return getNestedValue(dictionary, key);
};

export const getMessageWithFallback = async <K extends NestedKeyOfMessages>(
  key: K
): Promise<NestedValueOfMessages<K>> => {
  const dictionary = await getDictionary();
  const fallbackDictionary = await import(`../../messages/${defaultLocale}.ts`);
  return getMessageWithFallbackUtil(
    dictionary,
    fallbackDictionary.default,
    key
  );
};
