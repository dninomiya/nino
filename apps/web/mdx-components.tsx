import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "@/components/code-block";
import { createCodeSlotRenderer } from "remark-code-to-slot";
import { generateCodeHtml } from "@/lib/code-to-html";

const components: MDXComponents = {};

type CodeBlockProps = {
  lang: string;
  code: string;
  title: string;
  group?: string;
};

async function CodeBlockWrapper({
  groups,
  codes,
}: {
  groups?: string[];
  codes: CodeBlockProps[];
}) {
  // 各コードをHTMLに変換
  const codesWithHtml = await Promise.all(
    codes.map(async (item) => {
      const html = await generateCodeHtml(item.code, item.lang);

      return {
        ...item,
        html,
      };
    })
  );

  return <CodeBlock groups={groups} codes={codesWithHtml} />;
}

export function useMDXComponents(): MDXComponents {
  return {
    ...components,
    div: createCodeSlotRenderer({
      render: CodeBlockWrapper,
    }),
  };
}
