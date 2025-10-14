import {
  SiBun,
  SiCss,
  SiHtml5,
  SiJavascript,
  SiTypescript,
  SiYaml,
  SiNpm,
  SiYarn,
  SiPnpm,
} from "@icons-pack/react-simple-icons";
import { Terminal } from "lucide-react";
import {
  Codes,
  CodeHeader,
  CodeList,
  CodeTrigger,
  CodeContent,
  CodeDisplay,
  CodeCopyButton,
  CodeGroupSelector,
  CodeGroupOption,
} from "@/registry/blocks/codes";
import { generateCodeHtml } from "@/lib/code-to-html";

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

const codes = [
  {
    lang: "tsx",
    code: `const Demo = () => {
  return <div>Demo</div>;
}`,
    title: "demo.tsx",
    group: "TypeScript",
  },
  {
    lang: "js",
    code: `const Demo = () => {
  return "Demo";
}`,
    title: "demo.js",
    group: "JavaScript",
  },
];

const groups = ["TypeScript", "JavaScript"];

export default async function Preview() {
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
    <Codes defaultValue={defaultValue} groups={groups}>
      <CodeHeader>
        <CodeList>
          {codesWithValue.map((item, i) => {
            const Icon = icons[item.lang as keyof typeof icons];
            const label =
              item.title || (item.lang === "sh" ? "ターミナル" : item.lang);

            return (
              <CodeTrigger key={i} value={item.value} group={item.group}>
                {Icon && <Icon className="size-3.5" />}
                <span>{label}</span>
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
