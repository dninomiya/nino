import type { MDXComponents } from "mdx/types";
import {
  SingleCodeBlock,
  CodeGroup,
} from "@workspace/registry/blocks/code-block/code-block";
import { createCodeSlotRenderer } from "remark-code-to-slot";

const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return {
    ...components,
    div: createCodeSlotRenderer({
      codeGroupRenderer: (items) => <CodeGroup items={items} />,
      codeRenderer: (props) => <SingleCodeBlock {...props} />,
    }),
  };
}
