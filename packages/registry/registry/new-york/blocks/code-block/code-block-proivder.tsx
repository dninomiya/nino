"use client";

import {
  SiCss,
  SiHtml5,
  SiJavascript,
  SiTypescript,
  SiYaml,
} from "@icons-pack/react-simple-icons";

import { createContext, ReactNode, use, useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Check, Copy, Terminal } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Tabs, TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

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

type Item = {
  code: string;
  title: string;
  lang: string;
};

type CodeBlockContextType = {
  currentPackageManager: string;
  currentLanguage: string;
  currentId: string;
  setCurrentId: (id: string) => void;
  setCurrentLanguage: (language: string) => void;
  setCurrentPackageManager: (packageManager: string) => void;
  items: Item[];
};

const CodeBlockContext = createContext<CodeBlockContextType>({
  currentPackageManager: "pnpm",
  currentLanguage: "ts",
  currentId: "",
  setCurrentId: () => {},
  setCurrentLanguage: () => {},
  setCurrentPackageManager: () => {},
  items: [],
});

export function CodeBlockProvider({
  children,
  initialId,
  items,
}: {
  children: ReactNode;
  initialId: string;
  items: {
    code: string;
    title: string;
    lang: string;
  }[];
}) {
  const [currentPackageManager, setCurrentPackageManager] =
    useState<string>("pnpm");
  const [currentLanguage, setCurrentLanguage] = useState<string>("ts");
  const [currentId, setCurrentId] = useState<string>(initialId);

  useEffect(() => {
    const packageManager = localStorage.getItem("code-block-package-manager");
    const language = localStorage.getItem("code-block-language");
    if (packageManager) {
      setCurrentPackageManager(packageManager);
    }
    if (language) {
      setCurrentLanguage(language);
    }
  }, []);

  return (
    <CodeBlockContext
      value={{
        items,
        currentPackageManager,
        currentLanguage,
        currentId,
        setCurrentId,
        setCurrentLanguage,
        setCurrentPackageManager,
      }}
    >
      <Tabs value={currentId} onValueChange={setCurrentId}>
        {children}
      </Tabs>
    </CodeBlockContext>
  );
}

export const useCodeBlock = () => {
  return use(CodeBlockContext);
};

export const CodeTitle = ({ lang, title }: { lang: string; title: string }) => {
  const Icon = icons[lang as keyof typeof icons];
  const resolvedTitle = title || (lang === "sh" ? "ターミナル" : lang);

  return (
    <TabsTrigger
      value={title}
      title={resolvedTitle}
      className="flex px-2 py-1 rounded items-center gap-2 text-sm aria-selected:outline-none aria-selected:bg-muted only:bg-transparent!"
    >
      <Icon className="size-3.5" />
      <span className="text-nowrap truncate max-w-50">{resolvedTitle}</span>
    </TabsTrigger>
  );
};

export const CodeContent = ({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) => {
  return <TabsContent value={id}>{children}</TabsContent>;
};

export const CopyCodeButton = () => {
  const { currentId, items } = useCodeBlock();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    const code = items.find((item) => item.title === currentId)?.code;
    const cleanCode = code?.replace(/\s*\/\/\s*\[!.*$/gm, "");

    if (!cleanCode) return;

    navigator.clipboard.writeText(cleanCode);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const baseClass =
    "size-4 text-muted-foreground absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transition duration-300";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      className="relative"
    >
      <Copy className={cn(baseClass, isCopied && "opacity-0 scale-50")} />
      <Check className={cn(baseClass, !isCopied && "opacity-0 scale-50")} />
      <span className="sr-only">Copy Code</span>
    </Button>
  );
};

export function LangSelector({ titles }: { titles: string[] }) {
  const { currentId, setCurrentId } = useCodeBlock();

  return (
    <Select value={currentId} onValueChange={setCurrentId}>
      <SelectTrigger className="[&_span]:truncate [&_span]:max-w-20 [&_span]:block!">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-w-80" align="end">
        {titles.map((title) => (
          <SelectItem
            key={title}
            value={title}
            className="[&_span]:truncate [&_span]:block!"
          >
            {title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
