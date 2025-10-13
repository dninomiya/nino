import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "@/components/code-block";
import { createCodeSlotRenderer } from "remark-code-to-slot";
import {
  ComponentPreview,
  ComponentPreviewCode,
  ComponentPreviewDemo,
} from "./components/code-preview";

const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return {
    ...components,
    div: createCodeSlotRenderer({
      render: CodeBlock,
    }),
    ComponentPreview: ComponentPreview,
    ComponentPreviewCode: ComponentPreviewCode,
    ComponentPreviewDemo: ComponentPreviewDemo,
  };
}
