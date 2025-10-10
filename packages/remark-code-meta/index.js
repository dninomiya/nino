// plugins/rehype-code-figure.js
import { visit } from 'unist-util-visit';

/**
 * rehype-code-figure
 *
 * 期待する入力:
 *   <pre><code class="language-ts:demo.ts">...</code></pre>
 *   └ remark-parse が ```ts:demo.ts の lang をそのまま className に落とす想定
 *
 * 出力:
 *   <figure data-filename="demo.ts" data-lang="ts" data-raw="...">
 *     <pre><code class="language-ts">...</code></pre>
 *   </figure>
 */
export default function rehypeCodeFigure() {

  return (tree) => {
    visit(tree, 'element', (preNode, index, parent) => {
      if (!parent || preNode.tagName !== 'pre') return;
      const code = preNode.children?.find(
        (c) => c.type === 'element' && c.tagName === 'code'
      );
      if (!code) return;

      const cls = code.properties?.className;
      // className は string or string[]
      const classList = Array.isArray(cls) ? cls : (cls ? [cls] : []);

      // "language-xxx:filename.ext" を探す
      const langItem = classList.find((c) => typeof c === 'string' && c.startsWith('language-'));
      if (!langItem) return;

      const afterPrefix = String(langItem).slice('language-'.length);
      // 例) "ts:demo.ts" or "tsx:demo.tsx" or "ts"
      const i = afterPrefix.indexOf(':');

      let lang, filename;
      if (i >= 0) {
        // コロンがある場合: lang と filename に分割
        lang = afterPrefix.slice(0, i).trim();
        filename = afterPrefix.slice(i + 1).trim();
      } else {
        // コロンがない場合: 全体が lang
        lang = afterPrefix.trim();
        filename = '';
      }

      // 既存 className から "language-xxx:filename" を "language-xxx" に正規化
      const normalizedClassList = classList.map((c) => {
        if (c === langItem) return `language-${lang}`;
        return c;
      });
      code.properties.className = normalizedClassList;

      // コード本文（text ノードを結合）
      const raw = code.children
        ?.filter((ch) => ch.type === 'text')
        .map((t) => t.value)
        .join('') ?? '';

      // すでに figure 内なら再ラップせず属性を親に付与
      if (parent.type === 'element' && parent.tagName === 'figure') {
        parent.properties ??= {};
        parent.properties['data-filename'] = filename;
        parent.properties['data-lang'] = lang;
        parent.properties['data-raw'] = raw;
        return;
      }

      // 新しく figure を作り、pre を丸ごと子に入れる（＝二重preを作らない）
      const figure = {
        type: 'element',
        tagName: 'figure',
        properties: {
          'data-filename': filename,
          'data-lang': lang,
          'data-raw': raw,
        },
        children: [preNode],
      };

      parent.children.splice(index, 1, figure);
    });
  };
}