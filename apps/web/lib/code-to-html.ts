import "server-only";

import {
  transformerNotationDiff,
  transformerNotationHighlight,
} from "@shikijs/transformers";
import { codeToHtml } from "shiki";
import { cacheLife } from "next/cache";

/**
 * コードをシンタックスハイライト付きのHTMLに変換する共通関数
 * @param code - 変換するコード文字列
 * @param lang - プログラミング言語
 * @returns HTMLに変換されたコード
 */
export async function generateCodeHtml(code: string, lang: string) {
  "use cache";
  cacheLife("max");

  return await codeToHtml(code, {
    lang,
    themes: {
      dark: "github-dark",
      light: "github-light",
    },
    transformers: [transformerNotationDiff(), transformerNotationHighlight()],
  });
}
