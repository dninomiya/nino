import {
  SiCss,
  SiHtml5,
  SiJavascript,
  SiTypescript,
  SiYaml,
} from "@icons-pack/react-simple-icons";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
} from "@shikijs/transformers";
import { CopyButton } from "@workspace/ui/blocks/copy-button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@workspace/ui/components/tabs";
import { Terminal } from "lucide-react";
import { codeToHtml } from "shiki";

const icons = {
  ts: SiTypescript,
  tsx: SiTypescript,
  js: SiJavascript,
  jsx: SiJavascript,
  css: SiCss,
  html: SiHtml5,
  yml: SiYaml,
  sh: Terminal,
} as const;

type CodeBlockProps = {
  lang: string;
  code: string;
  title: string;
};

export function SingleCodeBlock({ title, lang, code }: CodeBlockProps) {
  return (
    <CodeCard>
      <CodeCardHeader>
        <CodeTitle lang={lang} title={title} />
        <span className="flex-1" />
        <CodeCopyButton code={code} />
      </CodeCardHeader>
      <Code code={code} lang={lang} />
    </CodeCard>
  );
}

export function CodeGroup({ items }: { items: CodeBlockProps[] }) {
  const itemsWithId = items.map((item, index) => ({
    ...item,
    id: index.toString(),
  }));

  if (itemsWithId.length === 0) {
    return null;
  }

  return (
    <Tabs className="not-prose" defaultValue={itemsWithId[0]?.id}>
      <TabsList>
        {itemsWithId.map((item) => (
          <TabsTrigger key={item.id} value={item.id}>
            {item.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {itemsWithId.map((item) => (
        <TabsContent key={item.id} value={item.id}>
          <SingleCodeBlock
            title={item.title}
            lang={item.lang}
            code={item.code}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function CodeCard({ children }: { children: React.ReactNode }) {
  return (
    <figure className="border rounded-lg overflow-hidden">{children}</figure>
  );
}

function CodeCardHeader({ children }: { children: React.ReactNode }) {
  return (
    <figcaption className="flex gap-2 h-12 text-sm text-muted-foreground items-center pl-4 pr-2 border-b not-prose">
      {children}
    </figcaption>
  );
}

function CodeTitle({ lang, title }: { lang: string; title: string }) {
  const Icon = icons[lang as keyof typeof icons];
  const resolvedTitle = title || lang === "sh" ? "ターミナル" : lang;

  return (
    <span className="flex items-center gap-2 text-[13px]">
      <Icon className="size-4" />
      {resolvedTitle}
    </span>
  );
}

async function Code({ code, lang }: { code: string; lang: string }) {
  const html = await codeToHtml(code, {
    lang: lang,
    themes: {
      dark: "github-dark",
      light: "github-light",
    },
    transformers: [transformerNotationDiff(), transformerNotationHighlight()],
  });

  return (
    <div
      className="
      not-prose
  *:border-none *:focus-visible:outline-none *:p-0! *:m-0 text-sm
  overflow-auto
  [&_code]:py-3 [&_code]:flex [&_code]:flex-col [&_code]:w-fit
  [&_.line]:px-4 [&_.line]:leading-relaxed [&_.line]:py-px
  [&_.highlighted]:bg-muted
  "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function CodeCopyButton({ code }: { code: string }) {
  const cleanCode = code.replace(/\s*\/\/\s*\[!.*$/gm, "");
  return <CopyButton value={cleanCode} />;
}
