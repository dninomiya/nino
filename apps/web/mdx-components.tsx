import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "@workspace/registry/blocks/code-block/code-block";
import { createCodeSlotRenderer } from "remark-code-to-slot";

const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return {
    ...components,
    div: createCodeSlotRenderer({
      codeGroupRenderer: ({ items, type }) => {
        console.log(items, type);
        return <CodeBlock items={items} type={type} />;
      },
      codeRenderer: (item) => <CodeBlock items={[item]} />,
    }),
  };
}
