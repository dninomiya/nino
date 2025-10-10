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

type CodeItem = {
  filename: string;
  lang: string;
  raw: string;
};

export function SingleCodeBlock({ filename, lang, raw }: CodeItem) {
  return (
    <CodeCard>
      <CodeCardHeader>
        <CodeTitle lang={lang} filename={filename} />
        <span className="flex-1" />
        <CodeCopyButton code={raw} />
      </CodeCardHeader>
      <Code raw={raw} lang={lang} />
    </CodeCard>
  );
}

export function CodeGroup({ rawData }: { rawData: string }) {
  const items = JSON.parse(rawData) as CodeItem[];
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
            {item.filename}
          </TabsTrigger>
        ))}
      </TabsList>
      {itemsWithId.map((item) => (
        <TabsContent key={item.id} value={item.id}>
          <SingleCodeBlock
            filename={item.filename}
            lang={item.lang}
            raw={item.raw}
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
    <figcaption className="flex gap-2 h-12 text-sm items-center px-4 border-b not-prose">
      {children}
    </figcaption>
  );
}

function CodeTitle({ lang, filename }: { lang: string; filename: string }) {
  const Icon = icons[lang as keyof typeof icons];
  const title = filename || lang === "sh" ? "ターミナル" : lang;

  return (
    <span className="flex items-center gap-2 text-[13px]">
      <Icon className="size-4" />
      {title}
    </span>
  );
}

async function Code({ raw, lang }: { raw: string; lang: string }) {
  const html = await codeToHtml(raw, {
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
  [&_.line]:px-4 [&_.line]:leading-relaxed
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
