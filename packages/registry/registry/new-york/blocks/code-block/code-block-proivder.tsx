"use client";

import {
  SiCss,
  SiHtml5,
  SiJavascript,
  SiTypescript,
  SiYaml,
} from "@icons-pack/react-simple-icons";

import { Tabs, TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";
import { Check, Copy, Terminal } from "lucide-react";
import {
  createContext,
  Dispatch,
  ReactNode,
  use,
  useEffect,
  useMemo,
  useState,
} from "react";

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
  currentId: string;
  setCurrentId: (id: string) => void;
  codes: Item[];
  groups?: string[];
};

const CodeBlockContext = createContext<CodeBlockContextType>({
  currentId: "",
  setCurrentId: () => {},
  codes: [],
});

const CodeBlockGroupContext = createContext({
  activeGroups: [] as string[],
  setActiveGroups: (() => {}) as Dispatch<React.SetStateAction<string[]>>,
});

export function CodeBlockGroupProvider({ children }: { children: ReactNode }) {
  const [activeGroups, setActiveGroups] = useState<string[]>([]);

  useEffect(() => {
    const groups = localStorage.getItem("code-block-groups");
    if (groups) {
      try {
        setActiveGroups(JSON.parse(groups));
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    if (activeGroups.length > 0) {
      localStorage.setItem("code-block-groups", JSON.stringify(activeGroups));
    } else {
      localStorage.removeItem("code-block-groups");
    }
  }, [activeGroups]);

  return (
    <CodeBlockGroupContext
      value={{
        activeGroups,
        setActiveGroups,
      }}
    >
      {children}
    </CodeBlockGroupContext>
  );
}

export const useCodeBlockGroup = () => use(CodeBlockGroupContext);

export function CodeBlockProvider({
  children,
  initialId,
  codes,
  groups,
}: {
  children: ReactNode;
  initialId: string;
  groups?: string[];
  codes: {
    code: string;
    title: string;
    lang: string;
  }[];
}) {
  const [currentId, setCurrentId] = useState<string>(initialId);

  return (
    <CodeBlockContext
      value={{
        codes,
        currentId,
        setCurrentId,
        groups,
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

export const CodeTitle = ({
  lang,
  title,
  group,
}: {
  lang: string;
  title: string;
  group: string;
}) => {
  const Icon = icons[lang as keyof typeof icons];
  const resolvedTitle = title || (lang === "sh" ? "ターミナル" : lang);

  const { activeGroups } = useCodeBlockGroup();
  const { groups } = useCodeBlock();
  const hasActiveGroups = activeGroups.length > 0;

  if (group) {
    if (hasActiveGroups && !activeGroups.includes(group)) {
      return null;
    }
    // fallback to first group
    if (!hasActiveGroups && groups && groups[0] !== group) {
      return null;
    }
  }

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
  const { currentId, codes } = useCodeBlock();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    const code = codes.find((code) => code.title === currentId)?.code;
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

export function CodeBlockGroupSelector({ groups }: { groups: string[] }) {
  const { activeGroups, setActiveGroups } = useCodeBlockGroup();
  const currentGroup = useMemo(() => {
    return groups.find((group) => activeGroups.includes(group)) || groups[0];
  }, [groups, activeGroups]);

  return (
    <Select
      value={currentGroup}
      onValueChange={(value) => {
        localStorage.setItem("code-block-group", value);
        setActiveGroups((values) => {
          const cleanItems = values.filter((value) => !groups.includes(value));
          return [...cleanItems, value];
        });
      }}
    >
      <SelectTrigger className="[&_span]:truncate [&_span]:max-w-20 [&_span]:block!">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-w-80" align="end">
        {groups.map((group) => (
          <SelectItem
            key={group}
            value={group}
            className="[&_span]:truncate [&_span]:block!"
          >
            {group}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
