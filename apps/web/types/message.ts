import jaMessages from "@/messages/ja";

// 再帰的なキーパスの型を生成するヘルパー型
type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}` | K
          : K
        : never;
    }[keyof T]
  : never;

// ネストされたキーから値を取得する型
type NestedValueOf<T, K extends string> = K extends `${infer P}.${infer S}`
  ? P extends keyof T
    ? NestedValueOf<T[P], S>
    : never
  : K extends keyof T
    ? T[K]
    : never;

// 日本語メッセージから型を抽出
export type MessagesSchema = typeof jaMessages;
export type KeyOfMessages = keyof MessagesSchema;
export type NestedKeyOfMessages = NestedKeyOf<MessagesSchema>;
export type NestedValueOfMessages<K extends NestedKeyOfMessages> =
  NestedValueOf<MessagesSchema, K>;
