import { SiJavascript, SiTypescript } from "@icons-pack/react-simple-icons";
import {
  Codes,
  CodeHeader,
  CodeList,
  CodeTrigger,
  CodeContent,
  CodeDisplay,
  CodeCopyButton,
  CodeGroupSelector,
  CodeGroupOption,
} from "@workspace/registry/blocks/codes/codes";

const codes = [
  {
    lang: "tsx",
    code: `const Demo: React.FC = () => {
  return <div>Demo</div>;
}`,
    html: `<pre><code class="language-tsx"><span class="line">const Demo: React.FC = () =&gt; {</span>
<span class="line">  return &lt;div&gt;Demo&lt;/div&gt;;</span>
<span class="line">}</span></code></pre>`,
    title: "demo.tsx",
    group: "TypeScript",
  },
  {
    lang: "js",
    code: `const Demo = () => {
  return <div>Demo</div>;
}`,
    html: `<pre><code class="language-js"><span class="line">const Demo = () =&gt; {</span>
<span class="line">  return &lt;div&gt;Demo&lt;/div&gt;;</span>
<span class="line">}</span></code></pre>`,
    title: "demo.js",
    group: "JavaScript",
  },
];

export function CodeBlock() {
  return (
    <Codes defaultValue="TypeScript-0" groups={["TypeScript", "JavaScript"]}>
      <CodeHeader>
        <CodeList>
          <CodeTrigger value="TypeScript-0" group="TypeScript">
            <SiTypescript className="size-3.5" />
            <span>demo.tsx</span>
          </CodeTrigger>
          <CodeTrigger value="JavaScript-1" group="JavaScript">
            <SiJavascript className="size-3.5" />
            <span>demo.js</span>
          </CodeTrigger>
        </CodeList>
        <span className="flex-1" />
        <CodeGroupSelector>
          <CodeGroupOption value="TypeScript">
            <SiTypescript className="size-3.5" />
            <span>TypeScript</span>
          </CodeGroupOption>
          <CodeGroupOption value="JavaScript">
            <SiJavascript className="size-3.5" />
            <span>JavaScript</span>
          </CodeGroupOption>
        </CodeGroupSelector>
        <CodeCopyButton />
      </CodeHeader>
      <CodeContent value="TypeScript-0" code={codes[0]!.code}>
        <CodeDisplay html={codes[0]!.html} />
      </CodeContent>
      <CodeContent value="JavaScript-1" code={codes[1]!.code}>
        <CodeDisplay html={codes[1]!.html} />
      </CodeContent>
    </Codes>
  );
}
