import {
  MessagesSchema,
  NestedKeyOfMessages,
  NestedValueOfMessages,
} from "@/types/message";

/**
 * ネストされたキーから値を取得する共通ユーティリティ関数
 */
export function getNestedValue<K extends NestedKeyOfMessages>(
  dictionary: MessagesSchema,
  key: K
): NestedValueOfMessages<K> {
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
}

/**
 * デフォルトロケールへのフォールバック機能付きでメッセージを取得
 */
export function getMessageWithFallback<K extends NestedKeyOfMessages>(
  dictionary: MessagesSchema,
  fallbackDictionary: MessagesSchema,
  key: K
): NestedValueOfMessages<K> {
  try {
    return getNestedValue(dictionary, key);
  } catch (error) {
    console.warn(
      `Key ${key} not found in current dictionary, falling back to default`
    );
    return getNestedValue(fallbackDictionary, key);
  }
}
