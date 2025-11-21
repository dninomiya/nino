import { generateCodeHtml } from "@/lib/code-to-html";
import {
  CodeContent,
  CodeCopyButton,
  CodeDisplay,
  CodeGroupOption,
  CodeGroupSelector,
  CodeHeader,
  CodeList,
  Codes,
  CodeTrigger,
} from "@workspace/registry/components/codes";
import {
  SiBun,
  SiCss,
  SiHtml5,
  SiJavascript,
  SiNpm,
  SiPnpm,
  SiTypescript,
  SiYaml,
  SiYarn,
} from "@icons-pack/react-simple-icons";
import { Terminal } from "lucide-react";
import { Suspense } from "react";

type CodeBlockProps = {
  lang: string;
  code: string;
  title?: string;
  group?: string;
};

// Icons mapping
const icons = {
  ts: SiTypescript,
  tsx: SiTypescript,
  js: SiJavascript,
  jsx: SiJavascript,
  css: SiCss,
  html: SiHtml5,
  yml: SiYaml,
  sh: Terminal,
  npm: SiNpm,
  yarn: SiYarn,
  bun: SiBun,
  pnpm: SiPnpm,
} as const;

/**
 * 統合CodeBlockコンポーネント
 * プリミティブコンポーネントを組み合わせた、すぐに使える統合コンポーネント
 */
async function CodeBlockContent({
  groups,
  codes,
  className,
}: {
  groups?: string[];
  codes: CodeBlockProps[];
  className?: string;
}) {
  // 各コードをHTMLに変換し、valueを割り当て
  const codesWithValue = await Promise.all(
    codes.map(async (item, i) => {
      const html = await generateCodeHtml(item.code, item.lang);
      return {
        ...item,
        html,
        value: item.group ? `${item.group}-${i}` : `${i}`,
      };
    })
  );

  // 最初のアイテムを defaultValue に
  const defaultValue = codesWithValue[0]?.value;

  return (
    <Codes className={className} defaultValue={defaultValue} groups={groups}>
      <CodeHeader>
        <CodeList>
          {codesWithValue.map((item, i) => {
            const Icon = icons[item.lang as keyof typeof icons];
            const label =
              item.title ||
              (item.lang.match(/^(sh|bash)$/) ? "ターミナル" : item.lang);

            return (
              <CodeTrigger key={i} value={item.value} group={item.group}>
                {Icon && <Icon className="size-3.5 shrink-0" />}
                <span className="truncate">{label}</span>
              </CodeTrigger>
            );
          })}
        </CodeList>
        <span className="flex-1" />
        {groups && groups.length > 0 && (
          <CodeGroupSelector>
            {groups.map((group) => {
              const Icon = icons[group.toLowerCase() as keyof typeof icons];
              return (
                <CodeGroupOption key={group} value={group}>
                  {Icon && <Icon className="size-3.5" />}
                  <span>{group}</span>
                </CodeGroupOption>
              );
            })}
          </CodeGroupSelector>
        )}
        <CodeCopyButton />
      </CodeHeader>
      {codesWithValue.map((item, i) => (
        <CodeContent key={i} value={item.value} code={item.code}>
          <CodeDisplay html={item.html} />
        </CodeContent>
      ))}
    </Codes>
  );
}

export function CodeBlock({
  groups,
  codes,
  className,
}: {
  groups?: string[];
  codes: CodeBlockProps[];
  className?: string;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CodeBlockContent groups={groups} codes={codes} className={className} />
    </Suspense>
  );
}
