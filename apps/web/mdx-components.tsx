import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "./components/code-block";

const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return {
    ...components,
    figure: ({ children, ...props }) => {
      const raw = props["data-raw"];
      const filename = props["data-filename"];
      const lang = props["data-lang"];

      return (
        <CodeBlock filename={filename} lang={lang} raw={raw}>
          {children}
        </CodeBlock>
      );
    },
  };
}
