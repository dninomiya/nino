import { CodeBlock } from "@/components/code-block";
import type { MDXComponents } from "mdx/types";
import { createCodeSlotRenderer } from "remark-code-to-slot";
import { RegistryInstallCommand } from "./app/[locale]/(main)/registry/components/registry-install-command";
import { headings } from "./components/article-headings";
import {
  ComponentPreview,
  ComponentPreviewCode,
  ComponentPreviewDemo,
} from "./components/code-preview";

export function useMDXComponents(): MDXComponents {
  return {
    ...headings,
    div: createCodeSlotRenderer({
      render: CodeBlock,
    }),
    RegistryInstallCommand,
    ComponentPreview: ComponentPreview,
    ComponentPreviewCode: ComponentPreviewCode,
    ComponentPreviewDemo: ComponentPreviewDemo,
  };
}
