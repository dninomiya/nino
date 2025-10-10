// plugins/remark-code-group.js
import { visit } from 'unist-util-visit';

/**
 * remark-code-group
 *
 * 1. ::: code-group と ::: のペアを検知し、
 *    内部の複数のコードブロックを <div data-metas="..."> でラップします。
 *
 * 2. グループ外の個別コードブロック（```lang:filename）を
 *    <div data-filename="..." data-lang="..." data-raw="..."> でラップします。
 *
 * 使用例:
 * ::: code-group
 *
 * ```ts:a.ts
 * aa
 * ```
 *
 * ```ts:b.ts
 * bb
 * ```
 *
 * :::
 *
 * グループ出力:
 * <div data-metas='[{"lang":"ts","filename":"a.ts"},{"lang":"ts","filename":"b.ts"}]' data-code-group="true">
 * </div>
 *
 * 個別出力:
 * <div data-filename="demo.ts" data-lang="ts" data-raw="..." data-code-single="true">
 * </div>
 */
export default function remarkCodeGroup() {
  return (tree) => {
    const nodesToProcess = [];
    const groupedCodeNodes = new Set();
    
    // 最初のパス: ::: code-group と ::: のペアを見つける
    visit(tree, (node, index, parent) => {
      if (node.type === 'paragraph') {
        const text = node.children?.find(child => child.type === 'text');
        if (text?.value?.trim() === ':::code-group') {
          // 開始マーカーを見つけた
          let endIndex = -1;
          let groupChildren = [];
          
          // 親のchildrenから開始位置以降を探索
          if (parent && parent.children) {
            for (let i = index + 1; i < parent.children.length; i++) {
              const sibling = parent.children[i];
              
              // 終了マーカーを探す
              if (sibling.type === 'paragraph') {
                const endText = sibling.children?.find(child => child.type === 'text');
                if (endText?.value?.trim() === ':::') {
                  endIndex = i;
                  break;
                }
              }
              
              // グループ内の子要素を収集
              groupChildren.push(sibling);
            }
          }
          
          if (endIndex !== -1) {
            nodesToProcess.push({
              startIndex: index,
              endIndex: endIndex,
              parent: parent,
              children: groupChildren
            });
          }
        }
      }
    });
    
    // 2番目のパス: 見つかったグループを処理（後ろから処理してインデックスがずれないように）
    nodesToProcess.reverse().forEach(({ startIndex, endIndex, parent, children }) => {
      // 子要素からコードブロックを探してメタデータを収集
      const metas = [];
      
      visit({ type: 'root', children }, 'code', (codeNode) => {
        // グループ内のコードブロックをマーク
        groupedCodeNodes.add(codeNode);
        
        const lang = codeNode.lang || '';
        let filename = '';
        
        // lang に ":" が含まれている場合、filename を抽出し、langを正規化
        const colonIndex = lang.indexOf(':');
        if (colonIndex >= 0) {
          filename = lang.slice(colonIndex + 1).trim();
          const actualLang = lang.slice(0, colonIndex).trim();
          codeNode.lang = actualLang; // コードブロックのlangを正規化
          
          // コード本文を取得
          const raw = codeNode.value || '';
          
          metas.push({
            lang: actualLang,
            filename: filename,
            raw: raw,
          });
        } else {
          // コード本文を取得
          const raw = codeNode.value || '';
          
          metas.push({
            lang: lang,
            filename: '',
            raw: raw,
          });
        }
      });
      
      // 開始マーカーを MDX JSX 要素に変換
      const startNode = parent.children[startIndex];
      startNode.type = 'mdxJsxFlowElement';
      startNode.name = 'div';
      startNode.attributes = [
        {
          type: 'mdxJsxAttribute',
          name: 'data-code-group-items',
          value: JSON.stringify(metas),
        },
        {
          type: 'mdxJsxAttribute',
          name: 'data-code-group',
          value: 'true',
        },
      ];
      startNode.children = []; // 空の要素
      
      // 終了マーカーを削除
      parent.children.splice(endIndex, 1);
      
      // 開始マーカーと終了マーカーの間の要素を削除（既にstartNode.childrenに移動済み）
      parent.children.splice(startIndex + 1, endIndex - startIndex - 1);
    });
    
    // 3番目のパス: グループ外の個別コードブロックを処理
    const codeNodesToWrap = [];
    
    visit(tree, 'code', (codeNode, index, parent) => {
      // グループ内のコードブロックはスキップ
      if (groupedCodeNodes.has(codeNode)) return;
      
      const lang = codeNode.lang || '';
      let filename = '';
      let actualLang = lang;
      
      // lang に ":" が含まれている場合、filename を抽出
      const colonIndex = lang.indexOf(':');
      if (colonIndex >= 0) {
        filename = lang.slice(colonIndex + 1).trim();
        actualLang = lang.slice(0, colonIndex).trim();
        codeNode.lang = actualLang; // コードブロックのlangを正規化
      }
      
      // コード本文を取得
      const raw = codeNode.value || '';
      
      codeNodesToWrap.push({
        codeNode,
        index,
        parent,
        filename,
        lang: actualLang,
        raw,
      });
    });
    
    // 後ろから処理してインデックスがずれないように
    codeNodesToWrap.reverse().forEach(({ codeNode, index, parent, filename, lang, raw }) => {
      // コードブロックを空のdivに置き換え（属性のみ）
      const wrapper = {
        type: 'mdxJsxFlowElement',
        name: 'div',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'data-filename',
            value: filename,
          },
          {
            type: 'mdxJsxAttribute',
            name: 'data-lang',
            value: lang,
          },
          {
            type: 'mdxJsxAttribute',
            name: 'data-raw',
            value: raw,
          },
          {
            type: 'mdxJsxAttribute',
            name: 'data-code-single',
            value: 'true',
          },
        ],
        children: [], // 空の要素
      };
      
      parent.children[index] = wrapper;
    });
  };
}

