import {
  CodeCard,
  CodeCardHeader,
  CodeTabsList,
  CodeTitle,
  CodeContent,
  CodeDisplay,
  CopyCodeButton,
  CodeBlockGroupSelector,
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
    <CodeCard codes={codesWithId} groups={groups}>
      <CodeCardHeader>
        <CodeTabsList>
          {codesWithId.map((item, i) => (
            <CodeTitle
              key={i}
              id={item.id}
              lang={item.lang}
              title={item.title}
              group={item.group}
            />
          ))}
        </CodeTabsList>
        <span className="flex-1" />
        {groups && groups.length > 0 && (
          <CodeBlockGroupSelector groups={groups} />
        )}
        <CopyCodeButton />
      </CodeCardHeader>
      {codesWithId.map((item, i) => (
        <CodeContent key={i} id={item.id}>
          <CodeDisplay html={item.html} />
        </CodeContent>
      ))}
    </CodeCard>
  );
}

// 便利のため、CodeBlockGroupProviderも再エクスポート
export { CodeBlockGroupProvider } from "@workspace/registry/blocks/code-block/code-block";
