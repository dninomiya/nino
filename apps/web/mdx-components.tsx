import type { MDXComponents } from "mdx/types";
import { SingleCodeBlock, CodeGroup } from "./components/code-block";

const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return {
    ...components,
    div: ({ children, ...props }) => {
      const isCodeGroup = props["data-code-group"];
      const isCodeSingle = props["data-code-single"];
      const codeGroupItems = props["data-code-group-items"];
      const raw = props["data-raw"];
      const filename = props["data-filename"];
      const lang = props["data-lang"];

      if (isCodeGroup) {
        return <CodeGroup rawData={codeGroupItems} />;
      }

      if (isCodeSingle) {
        return <SingleCodeBlock filename={filename} lang={lang} raw={raw} />;
      }
    },
  };
}
