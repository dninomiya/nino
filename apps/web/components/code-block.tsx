import {
  SiCss,
  SiHtml5,
  SiJavascript,
  SiTypescript,
  SiYaml,
} from "@icons-pack/react-simple-icons";
import { CopyButton } from "@workspace/ui/blocks/copy-button";
import { Terminal } from "lucide-react";

const icons = {
  ts: SiTypescript,
  tsx: SiTypescript,
  js: SiJavascript,
  jsx: SiJavascript,
  css: SiCss,
  html: SiHtml5,
  yml: SiYaml,
  sh: Terminal,
} as const;

export const CodeBlock = ({
  children,
  filename,
  lang,
  raw,
}: {
  children: React.ReactNode;
  filename: string;
  lang: string;
  raw: string;
}) => {
  const Icon = icons[lang as keyof typeof icons];

  return (
    <figure className="border rounded-lg overflow-hidden bg-transparent!">
      <figcaption className="flex gap-2 h-12 text-sm items-center px-3 border-b not-prose">
        <Icon className="size-4" />
        <span className="flex-1">{filename}</span>
        <CopyButton value={raw} />
      </figcaption>
      <div className="*:m-0 *:rounded-t-none *:border-none *:focus-visible:outline-none">
        {children}
      </div>
    </figure>
  );
};
