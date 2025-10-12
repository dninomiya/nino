import { TabsList } from "@radix-ui/react-tabs";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
} from "@shikijs/transformers";
import { codeToHtml } from "shiki";
import {
  CodeBlockProvider,
  CodeContent,
  CodeTitle,
  CopyCodeButton,
  CodeBlockGroupSelector,
} from "./code-block-proivder";

type CodeBlockProps = {
  lang: string;
  code: string;
  title: string;
  group: string;
};

export function CodeBlock({
  groups,
  codes,
}: {
  groups?: string[];
  codes: CodeBlockProps[];
}) {
  const firstItem = codes[0];

  if (!firstItem) {
    return <p>No codes</p>;
  }

  return (
    <CodeBlockProvider
      initialId={firstItem.title}
      codes={codes}
      groups={groups}
    >
      <CodeCard>
        <CodeCardHeader>
          <TabsList className="flex gap-1 overflow-auto">
            {codes.map((item) => (
              <CodeTitle
                key={item.title}
                lang={item.lang}
                title={item.title}
                group={item.group}
              />
            ))}
          </TabsList>
          <span className="flex-1" />
          {groups && groups.length > 0 && (
            <CodeBlockGroupSelector groups={groups} />
          )}
          <CopyCodeButton />
        </CodeCardHeader>
        {codes.map((item) => (
          <CodeContent key={item.title} id={item.title}>
            <Code code={item.code} lang={item.lang} />
          </CodeContent>
        ))}
      </CodeCard>
    </CodeBlockProvider>
  );
}

function CodeCard({ children }: { children: React.ReactNode }) {
  return (
    <figure className="border rounded-lg overflow-hidden">{children}</figure>
  );
}

function CodeCardHeader({ children }: { children: React.ReactNode }) {
  return (
    <figcaption className="flex gap-2 h-12 text-sm text-muted-foreground items-center px-2 border-b not-prose">
      {children}
    </figcaption>
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
