import { CodeBlock } from "@/components/code-block";
import { MDXLink } from "@/components/mdx-link";
import { MDXParagraph } from "@/components/mdx-paragraph";
import type { MDXComponents } from "mdx/types";
import { createCodeSlotRenderer } from "remark-code-to-slot";
import { RegistryInstallCommand } from "./app/[locale]/(main)/registry/components/registry-install-command";
import { headings } from "./components/article-headings";
import {
  ComponentPreview,
  ComponentPreviewCode,
  ComponentPreviewDemo,
} from "./components/code-preview";
import { GoodToKnow } from "./components/good-to-know";

export function useMDXComponents(): MDXComponents {
  return {
    ...headings,
    a: MDXLink,
    p: MDXParagraph,
    div: createCodeSlotRenderer({
      render: CodeBlock,
    }),
    GoodToKnow,
    RegistryInstallCommand,
    ComponentPreview: ComponentPreview,
    ComponentPreviewCode: ComponentPreviewCode,
    ComponentPreviewDemo: ComponentPreviewDemo,
  };
}
