"use client";

import {
  SiCss,
  SiHtml5,
  SiJavascript,
  SiTypescript,
  SiYaml,
} from "@icons-pack/react-simple-icons";
import { Slot } from "@radix-ui/react-slot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
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
import * as React from "react";
import {
  createContext,
  Dispatch,
  ReactNode,
  use,
  useCallback,
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

// Variants
const codeBlockTitleVariants = cva(
  "flex items-center gap-2 text-sm rounded px-2 py-1 outline-none transition-colors text-nowrap truncate max-w-50",
  {
    variants: {
      variant: {
        default:
          "aria-selected:bg-muted hover:bg-muted/50 aria-selected:outline-none",
      },
      size: {
        default: "text-sm px-2 py-1",
        sm: "text-xs px-1.5 py-0.5",
        lg: "text-base px-3 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const copyButtonVariants = cva(
  "relative size-4 text-muted-foreground absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transition duration-300",
  {
    variants: {
      state: {
        idle: "opacity-100 scale-100",
        copied: "opacity-0 scale-50",
      },
    },
    defaultVariants: {
      state: "idle",
    },
  }
);

// Types
export type CodeBlockItem = {
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
  codes: CodeBlockItem[];
  groups?: string[];
  currentGroup?: string;
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
function CodeBlockGroupProvider({
  children,
  defaultActiveGroups = [],
}: {
  children: ReactNode;
  defaultActiveGroups?: string[];
}) {
  const [activeGroups, setActiveGroups] =
    useState<string[]>(defaultActiveGroups);

  useEffect(() => {
    const groups = localStorage.getItem("code-block-groups");
    if (groups) {
      try {
        setActiveGroups(JSON.parse(groups));
      } catch (error) {
        console.error(error);
      }
    } else if (defaultActiveGroups.length > 0) {
      // localStorageに値がない場合のみdefaultを使用
      setActiveGroups(defaultActiveGroups);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // defaultActiveGroupsは初期値なので依存配列に含めない

  useEffect(() => {
    if (activeGroups.length > 0) {
      localStorage.setItem("code-block-groups", JSON.stringify(activeGroups));
    } else {
      localStorage.removeItem("code-block-groups");
    }
  }, [activeGroups]);

  const contextValue = React.useMemo(
    () => ({
      activeGroups,
      setActiveGroups,
    }),
    [activeGroups]
  );

  return (
    <CodeBlockGroupContext value={contextValue}>
      {children}
    </CodeBlockGroupContext>
  );
}

// Hooks
const useCodeBlockGroup = () => use(CodeBlockGroupContext);
const useCodeBlock = () => use(CodeBlockContext);

// Block Provider (Internal use only)
function CodeBlockProvider({
  children,
  initialId,
  codes,
  groups = [],
}: {
  children: ReactNode;
  initialId: string;
  groups?: string[];
  codes: CodeBlockItem[];
}) {
  const [currentId, _setCurrentId] = useState<string>(initialId);
  const { activeGroups } = useCodeBlockGroup();
  const currentGroup = useMemo(() => {
    return groups.find((group) => activeGroups.includes(group)) || groups[0];
  }, [groups, activeGroups]);

  const setCurrentId = useCallback((id: string) => {
    _setCurrentId(id);
  }, []);

  // グループが切り替わったときに、そのグループの最初のタブに切り替える
  useEffect(() => {
    if (currentGroup && codes.length > 0) {
      // 現在のグループに属する最初のコードのインデックスを見つける
      const firstCodeIndexInGroup = codes.findIndex(
        (code) => code.group === currentGroup
      );

      if (firstCodeIndexInGroup !== -1) {
        const newId = `${currentGroup}-${firstCodeIndexInGroup}`;
        _setCurrentId(newId);
      }
    }
  }, [currentGroup, codes]);

  const contextValue = React.useMemo<CodeBlockContextType>(
    () => ({
      codes,
      currentId,
      setCurrentId,
      groups,
      currentGroup,
    }),
    [codes, currentId, setCurrentId, groups, currentGroup]
  );

  return (
    <CodeBlockContext value={contextValue}>
      <Tabs value={currentId} onValueChange={setCurrentId}>
        {children}
      </Tabs>
    </CodeBlockContext>
  );
}

// UI Components
function CodeCard({
  codes,
  groups,
  defaultSelectedId,
  className,
  asChild = false,
  children,
  ...props
}: {
  codes: CodeBlockItem[];
  groups?: string[];
  defaultSelectedId?: string;
} & React.ComponentProps<"figure"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "figure";

  // 各コードアイテムにIDを割り当て
  const codesWithId = useMemo(
    () =>
      codes.map((item, i) => ({
        ...item,
        id: item.id || (item.group ? `${item.group}-${i}` : `${i}`),
      })),
    [codes]
  );

  // initialIdを自動生成
  const firstItem = codesWithId[0];
  const autoInitialId = firstItem?.group
    ? `${firstItem.group}-0`
    : firstItem
      ? `0`
      : "";
  const initialId = defaultSelectedId ?? autoInitialId;

  if (!firstItem) {
    return (
      <Comp
        data-code-block="card"
        data-slot="code-block-card"
        className={cn("border rounded-lg overflow-hidden", className)}
        {...props}
      >
        <p className="p-4 text-muted-foreground">No codes available</p>
      </Comp>
    );
  }

  return (
    <CodeBlockProvider
      initialId={initialId}
      codes={codesWithId}
      groups={groups}
    >
      <Comp
        data-code-block="card"
        data-slot="code-block-card"
        className={cn("border rounded-lg overflow-hidden", className)}
        {...props}
      >
        {children}
      </Comp>
    </CodeBlockProvider>
  );
}

function CodeCardHeader({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"figcaption"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "figcaption";

  return (
    <Comp
      data-code-block="header"
      data-slot="code-block-header"
      className={cn(
        "flex gap-2 h-12 text-sm text-muted-foreground items-center px-2 border-b not-prose",
        className
      )}
      {...props}
    />
  );
}

function CodeTabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsList>) {
  return (
    <TabsList
      data-code-block="tabs-list"
      data-slot="code-block-tabs-list"
      className={cn("flex gap-1 overflow-auto", className)}
      {...props}
    />
  );
}

function CodeDisplay({
  html,
  className,
  ...props
}: { html: string } & React.ComponentProps<"div">) {
  return (
    <div
      data-code-block="display"
      data-slot="code-block-display"
      className={cn(
        "not-prose",
        "*:border-none *:focus-visible:outline-none *:p-0! *:m-0 text-sm",
        "overflow-auto",
        "[&_code]:py-3 [&_code]:flex [&_code]:flex-col [&_code]:w-fit",
        "[&_.line]:px-4 [&_.line]:leading-relaxed [&_.line]:py-px",
        "[&_.highlighted]:bg-muted",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  );
}

function CodeTitle({
  id,
  lang,
  title,
  group,
  variant = "default",
  size = "default",
  className,
  ...props
}: {
  id: string;
  lang: string;
  title?: string;
  group?: string;
} & VariantProps<typeof codeBlockTitleVariants> &
  Omit<React.ComponentProps<typeof TabsTrigger>, "value">) {
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
      data-code-block="title"
      data-slot="code-block-title"
      data-group={group}
      value={id}
      title={resolvedTitle}
      className={cn(
        codeBlockTitleVariants({ variant, size }),
        "only:bg-transparent!",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="size-3.5" />}
      <span>{resolvedTitle}</span>
    </TabsTrigger>
  );
}

function CodeContent({
  id,
  className,
  ...props
}: { id: string } & Omit<React.ComponentProps<typeof TabsContent>, "value">) {
  return (
    <TabsContent
      data-code-block="content"
      data-slot="code-block-content"
      value={id}
      className={cn(className)}
      {...props}
    />
  );
}

function CopyCodeButton({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "onClick">) {
  const { currentId, codes } = useCodeBlock();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
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
  }, [currentId, codes]);

  return (
    <Button
      data-code-block="copy-button"
      data-slot="code-block-copy-button"
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      className={cn("relative", className)}
      {...props}
    >
      <Copy
        className={cn(
          copyButtonVariants({ state: isCopied ? "copied" : "idle" })
        )}
      />
      <Check
        className={cn(
          copyButtonVariants({ state: isCopied ? "idle" : "copied" })
        )}
      />
      <span className="sr-only">Copy Code</span>
    </Button>
  );
}

function CodeBlockGroupSelector({
  groups,
  ...props
}: {
  groups: string[];
} & Omit<React.ComponentProps<typeof Select>, "value" | "onValueChange">) {
  const { setActiveGroups } = useCodeBlockGroup();
  const { currentGroup } = useCodeBlock();

  const handleValueChange = useCallback(
    (value: string) => {
      localStorage.setItem("code-block-group", value);
      setActiveGroups((values) => {
        const cleanItems = values.filter((value) => !groups.includes(value));
        return [...cleanItems, value];
      });
    },
    [groups, setActiveGroups]
  );

  return (
    <Select value={currentGroup} onValueChange={handleValueChange} {...props}>
      <SelectTrigger
        data-code-block="group-selector-trigger"
        data-slot="code-block-group-selector-trigger"
        className="[&_span]:truncate [&_span]:max-w-20 [&_span]:block!"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        data-code-block="group-selector-content"
        data-slot="code-block-group-selector-content"
        className="max-w-80"
        align="end"
      >
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

export {
  CodeBlockGroupProvider,
  CodeCard,
  CodeCardHeader,
  CodeTabsList,
  CodeTitle,
  CodeContent,
  CodeDisplay,
  CopyCodeButton,
  CodeBlockGroupSelector,
  useCodeBlock,
  useCodeBlockGroup,
};
