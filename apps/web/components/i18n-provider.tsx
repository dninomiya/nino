"use client";

import { defaultLocale, Locale } from "@/lib/i18n/locale";
import {
  MessagesSchema,
  NestedKeyOfMessages,
  NestedValueOfMessages,
} from "@/types/message";
import { createContext, use } from "react";

const I18nContext = createContext<{
  locale: Locale;
  dictionary: MessagesSchema;
}>({
  locale: defaultLocale,
  dictionary: {} as MessagesSchema,
});

export function I18nProvider({
  children,
  locale,
  dictionary,
}: {
  children: React.ReactNode;
  locale: Locale;
  dictionary: MessagesSchema;
}) {
  return <I18nContext value={{ locale, dictionary }}>{children}</I18nContext>;
}

export function useI18n() {
  return use(I18nContext);
}

export const useMessage = <K extends NestedKeyOfMessages>(
  key: K
): NestedValueOfMessages<K> => {
  const { dictionary } = useI18n();

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
