import {
  Code,
  CodeHeader,
  CodeList,
  CodeTrigger,
  CodeContent,
  CodeDisplay,
  CodeCopyButton,
  CodeGroupSelector,
  type CodeBlockItem,
} from "@workspace/registry/blocks/code-block/code-block";

type CodeBlockProps = {
  lang: string;
  code: string;
  html: string;
  title?: string;
  group?: string;
};

/**
 * 統合CodeBlockコンポーネント
 * プリミティブコンポーネントを組み合わせた、すぐに使える統合コンポーネント
 */
export function CodeBlock({
  groups,
  codes,
}: {
  groups?: string[];
  codes: CodeBlockProps[];
}) {
  // 各コードアイテムにIDを割り当て
  const codesWithId: CodeBlockItem[] = codes.map((item, i) => ({
    ...item,
    id: item.group ? `${item.group}-${i}` : `${i}`,
  }));

  return (
    <Code codes={codesWithId} groups={groups}>
      <CodeHeader>
        <CodeList>
          {codesWithId.map((item, i) => (
            <CodeTrigger
              key={i}
              id={item.id}
              lang={item.lang}
              title={item.title}
              group={item.group}
            />
          ))}
        </CodeList>
        <span className="flex-1" />
        {groups && groups.length > 0 && <CodeGroupSelector groups={groups} />}
        <CodeCopyButton />
      </CodeHeader>
      {codesWithId.map((item, i) => (
        <CodeContent key={i} id={item.id}>
          <CodeDisplay html={item.html} />
        </CodeContent>
      ))}
    </Code>
  );
}

// 便利のため、CodeGroupProviderも再エクスポート
export { CodeGroupProvider } from "@workspace/registry/blocks/code-block/code-block";
