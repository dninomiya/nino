import "server-only";

import { defaultLocale, Locale, locales } from "./locale";
import { cache } from "react";
import {
  MessagesSchema,
  NestedKeyOfMessages,
  NestedValueOfMessages,
} from "@/types/message";

let _currentLocale: Locale | null = null;

export const setCurrentLocale = (locale: string) => {
  if (!locales.includes(locale as Locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  _currentLocale = locale as Locale;
};

export const getCurrentLocale = cache(() => {
  console.log(_currentLocale, "getCurrentLocale");
  return _currentLocale || defaultLocale;
});

export const getDiscionaly = async (): Promise<MessagesSchema> => {
  const messages = await import(`../../messages/${getCurrentLocale()}.ts`);
  return messages.default;
};

export const getMessage = async <K extends NestedKeyOfMessages>(
  key: K
): Promise<NestedValueOfMessages<K>> => {
  const dictionary = await getDiscionaly();
  const keys = key.split(".") as (keyof MessagesSchema)[];
  let result: unknown = dictionary;

  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      throw new Error(`Key ${k} not found in dictionary`);
    }
  }

  return result as NestedValueOfMessages<K>;
};
