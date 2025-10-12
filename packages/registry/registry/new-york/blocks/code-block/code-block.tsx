"use client";

import {
  SiCss,
  SiHtml5,
  SiJavascript,
  SiTypescript,
  SiYaml,
} from "@icons-pack/react-simple-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
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

// Icons mapping
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

// Types
type Item = {
  id: string;
  code: string;
  html: string;
  title?: string;
  lang: string;
  group?: string;
};

type CodeBlockContextType = {
  currentId: string;
  setCurrentId: (id: string) => void;
  codes: Item[];
  groups?: string[];
  currentGroup?: string;
};

type CodeBlockProps = {
  lang: string;
  code: string;
  html: string;
  title?: string;
  group?: string;
};

// Contexts
const CodeBlockContext = createContext<CodeBlockContextType>({
  currentId: "",
  setCurrentId: () => {},
  codes: [],
  currentGroup: "",
});

const CodeBlockGroupContext = createContext({
  activeGroups: [] as string[],
  setActiveGroups: (() => {}) as Dispatch<React.SetStateAction<string[]>>,
});

// Group Provider
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

// Hooks
export const useCodeBlockGroup = () => use(CodeBlockGroupContext);
export const useCodeBlock = () => use(CodeBlockContext);

// Block Provider
export function CodeBlockProvider({
  children,
  initialId,
  codes,
  groups = [],
}: {
  children: ReactNode;
  initialId: string;
  groups?: string[];
  codes: Item[];
}) {
  const [currentId, setCurrentId] = useState<string>(initialId);
  const { activeGroups } = useCodeBlockGroup();
  const currentGroup = useMemo(() => {
    return groups.find((group) => activeGroups.includes(group)) || groups[0];
  }, [groups, activeGroups]);

  // グループが切り替わったときに、そのグループの最初のタブに切り替える
  useEffect(() => {
    if (currentGroup && codes.length > 0) {
      // 現在のグループに属する最初のコードのインデックスを見つける
      const firstCodeIndexInGroup = codes.findIndex(
        (code) => code.group === currentGroup
      );

      if (firstCodeIndexInGroup !== -1) {
        const newId = `${currentGroup}-${firstCodeIndexInGroup}`;
        setCurrentId(newId);
      }
    }
  }, [currentGroup, codes]);

  return (
    <CodeBlockContext
      value={{
        codes,
        currentId,
        setCurrentId,
        groups,
        currentGroup,
      }}
    >
      <Tabs value={currentId} onValueChange={setCurrentId}>
        {children}
      </Tabs>
    </CodeBlockContext>
  );
}

// Main CodeBlock Component
export function CodeBlock({
  groups,
  codes,
}: {
  groups?: string[];
  codes: CodeBlockProps[];
}) {
  const firstItem = codes[0];

  if (!firstItem) {
    return <p>No codes</p>;
  }

  // 各コードアイテムにIDを割り当て
  const codesWithId: Item[] = codes.map((item, i) => ({
    ...item,
    id: item.group ? `${item.group}-${i}` : `${i}`,
  }));

  return (
    <CodeBlockProvider
      initialId={firstItem.group ? `${firstItem.group}-0` : `0`}
      codes={codesWithId}
      groups={groups}
    >
      <CodeCard>
        <CodeCardHeader>
          <TabsList className="flex gap-1 overflow-auto">
            {codesWithId.map((item, i) => (
              <CodeTitle
                key={i}
                id={item.id}
                lang={item.lang}
                title={item.title}
                group={item.group}
              />
            ))}
          </TabsList>
          <span className="flex-1" />
          {groups && groups.length > 0 && (
            <CodeBlockGroupSelector groups={groups} />
          )}
          <CopyCodeButton />
        </CodeCardHeader>
        {codesWithId.map((item, i) => (
          <CodeContent key={i} id={item.id}>
            <CodeDisplay html={item.html} />
          </CodeContent>
        ))}
      </CodeCard>
    </CodeBlockProvider>
  );
}

// UI Components
function CodeCard({ children }: { children: React.ReactNode }) {
  return (
    <figure className="border rounded-lg overflow-hidden">{children}</figure>
  );
}

function CodeCardHeader({ children }: { children: React.ReactNode }) {
  return (
    <figcaption className="flex gap-2 h-12 text-sm text-muted-foreground items-center px-2 border-b not-prose">
      {children}
    </figcaption>
  );
}

function CodeDisplay({ html }: { html: string }) {
  return (
    <div
      className="
      not-prose
  *:border-none *:focus-visible:outline-none *:p-0! *:m-0 text-sm
  overflow-auto
  [&_code]:py-3 [&_code]:flex [&_code]:flex-col [&_code]:w-fit
  [&_.line]:px-4 [&_.line]:leading-relaxed [&_.line]:py-px
  [&_.highlighted]:bg-muted
  "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export const CodeTitle = ({
  id,
  lang,
  title,
  group,
}: {
  id: string;
  lang: string;
  title?: string;
  group?: string;
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
    // fallback
    if (!hasActiveGroups && groups && groups[0] !== group) {
      return null;
    }
  }

  return (
    <TabsTrigger
      value={id}
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
    const code = codes.find((code) => code.id === currentId)?.code;
    /**
     * Removes shiki transformer notation lines from code.
     * @link https://shiki.style/packages/transformers
     */
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
  const { setActiveGroups } = useCodeBlockGroup();
  const { currentGroup } = useCodeBlock();

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
