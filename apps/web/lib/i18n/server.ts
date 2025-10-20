import "server-only";

import { defaultLocale, Locale, locales } from "./locale";
import { cache } from "react";
import { AsyncLocalStorage } from "async_hooks";
import {
  MessagesSchema,
  NestedKeyOfMessages,
  NestedValueOfMessages,
} from "@/types/message";
import {
  getNestedValue,
  getMessageWithFallback as getMessageWithFallbackUtil,
} from "./utils";

// AsyncLocalStorageを使用してリクエストごとのlocaleを管理
const localeStorage = new AsyncLocalStorage<Locale>();

export const setCurrentLocale = (locale: string) => {
  if (!locales.includes(locale as Locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  localeStorage.enterWith(locale as Locale);
};

export const getCurrentLocale = cache(() => {
  return localeStorage.getStore() || defaultLocale;
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
