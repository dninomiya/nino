import { codeToHtml } from "shiki";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
} from "@shikijs/transformers";

/**
 * コードをシンタックスハイライト付きのHTMLに変換する共通関数
 * @param code - 変換するコード文字列
 * @param lang - プログラミング言語
 * @returns HTMLに変換されたコード
 */
export async function generateCodeHtml(code: string, lang: string) {
  return await codeToHtml(code, {
    lang,
    themes: {
      dark: "github-dark",
      light: "github-light",
    },
    transformers: [transformerNotationDiff(), transformerNotationHighlight()],
  });
}
