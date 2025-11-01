"use client";

import {
  SiBun,
  SiCss,
  SiHtml5,
  SiJavascript,
  SiTypescript,
  SiYaml,
  SiNpm,
  SiYarn,
  SiPnpm,
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
  npm: SiNpm,
  yarn: SiYarn,
  bun: SiBun,
  pnpm: SiPnpm,
} as const;

// Variants
const codeTriggerVariants = cva(
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
type CodeContextType = {
  currentValue: string;
  setCurrentValue: (value: string) => void;
  codeMap: Map<string, string>;
  registerCode: (value: string, code: string) => void;
  groups: string[];
  registerGroup: (group: string) => void;
  currentGroup?: string;
  registerTab: (value: string, group?: string) => void;
};

// Contexts
const CodeContext = createContext<CodeContextType>({
  currentValue: "",
  setCurrentValue: () => {},
  codeMap: new Map(),
  registerCode: () => {},
  groups: [],
  registerGroup: () => {},
  currentGroup: undefined,
  registerTab: () => {},
});

const CodeGroupContext = createContext({
  activeGroups: [] as string[],
  setActiveGroups: (() => {}) as Dispatch<React.SetStateAction<string[]>>,
});

// Provider
function CodeProvider({
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

  return <CodeGroupContext value={contextValue}>{children}</CodeGroupContext>;
}

// Hooks
const useCodeGroup = () => use(CodeGroupContext);
const useCode = () => use(CodeContext);

// Block Provider (Internal use only)
function CodeInternalProvider({
  children,
  defaultValue,
  groups: initialGroups = [],
}: {
  children: ReactNode;
  defaultValue?: string;
  groups?: string[];
}) {
  const [currentValue, setCurrentValue] = useState<string>(defaultValue || "");
  const [codeMap, setCodeMap] = useState<Map<string, string>>(new Map());
  const [groups] = useState<string[]>(initialGroups);
  const [groupTabsMap, setGroupTabsMap] = useState<Map<string, string[]>>(
    new Map()
  );
  const { activeGroups, setActiveGroups } = useCodeGroup();

  const currentGroup = useMemo(() => {
    if (groups.length === 0) {
      return undefined;
    }

    const matchedGroup = groups.find((group) => activeGroups.includes(group));
    return matchedGroup ?? groups[0];
  }, [groups, activeGroups]);

  const registerCode = useCallback((value: string, code: string) => {
    setCodeMap((prev) => {
      const newMap = new Map(prev);
      newMap.set(value, code);
      return newMap;
    });
  }, []);

  const registerTab = useCallback((value: string, group?: string) => {
    if (group) {
      setGroupTabsMap((prev) => {
        const newMap = new Map(prev);
        const tabs = newMap.get(group) || [];
        if (!tabs.includes(value)) {
          newMap.set(group, [...tabs, value]);
        }
        return newMap;
      });
    }
  }, []);

  // groups が設定されているときに、activeGroups にこのコンポーネントのグループが含まれていない場合、
  // 最初のグループを自動選択
  useEffect(() => {
    if (groups.length > 0) {
      const firstGroup = groups[0];
      if (firstGroup) {
        setActiveGroups((prev) => {
          // すでにこのコンポーネントのグループが設定されているかチェック
          const hasAnyGroupFromThis = groups.some((g) => prev.includes(g));
          if (!hasAnyGroupFromThis) {
            return [...prev, firstGroup];
          }
          return prev;
        });
      }
    }
  }, [groups, setActiveGroups]);

  // currentGroup が変更されたときに、そのグループに属する最初のタブに自動的に切り替える
  useEffect(() => {
    if (currentGroup) {
      const tabsInGroup = groupTabsMap.get(currentGroup);
      if (tabsInGroup && tabsInGroup.length > 0) {
        const firstTab = tabsInGroup[0];
        if (firstTab && firstTab !== currentValue) {
          setCurrentValue(firstTab);
        }
      }
    }
  }, [currentGroup, groupTabsMap, currentValue]);

  const contextValue = React.useMemo<CodeContextType>(
    () => ({
      currentValue,
      setCurrentValue,
      codeMap,
      registerCode,
      groups,
      registerGroup: () => {}, // 互換性のために空の関数を提供
      currentGroup,
      registerTab,
    }),
    [
      currentValue,
      setCurrentValue,
      codeMap,
      registerCode,
      groups,
      currentGroup,
      registerTab,
    ]
  );

  return (
    <CodeContext value={contextValue}>
      <Tabs
        className="w-full flex-1"
        value={currentValue}
        onValueChange={setCurrentValue}
      >
        {children}
      </Tabs>
    </CodeContext>
  );
}

// UI Components
function Codes({
  defaultValue,
  groups,
  className,
  asChild = false,
  children,
  ...props
}: {
  defaultValue?: string;
  groups?: string[];
} & React.ComponentProps<"figure"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "figure";

  return (
    <CodeInternalProvider defaultValue={defaultValue} groups={groups}>
      <Comp
        data-code-block="card"
        data-slot="code-block-card"
        className={cn(
          "border rounded-lg bg-background overflow-hidden",
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    </CodeInternalProvider>
  );
}

function CodeHeader({
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

function CodeList({
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
        "[&_pre]:bg-transparent! [&_pre]:dark:bg-transparent!",
        "[&_code]:py-3 [&_code]:flex [&_code]:flex-col [&_code]:w-fit [&_code]:min-w-full",
        "[&_.line]:px-4 [&_.line]:leading-relaxed [&_.line]:py-px",
        "[&_.highlighted]:bg-muted",
        "[&_.add]:bg-muted",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  );
}

function CodeTrigger({
  value,
  group,
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}: {
  value: string;
  group?: string;
  children?: ReactNode;
} & VariantProps<typeof codeTriggerVariants> &
  Omit<React.ComponentProps<typeof TabsTrigger>, "value"> & { value: string }) {
  const { currentGroup, groups, registerTab } = useCode();

  // タブとグループの対応関係を登録
  useEffect(() => {
    registerTab(value, group);
  }, [value, group, registerTab]);

  // グループフィルタリング
  if (group && groups.length > 0) {
    // groups が登録されている場合のみフィルタリング
    if (!currentGroup || currentGroup !== group) {
      return null;
    }
  }

  return (
    <TabsTrigger
      data-code-block="title"
      data-slot="code-block-title"
      data-group={group}
      value={value}
      className={cn(
        codeTriggerVariants({ variant, size }),
        "only:bg-transparent!",
        className
      )}
      {...props}
    >
      {children}
    </TabsTrigger>
  );
}

function CodeContent({
  value,
  code,
  className,
  children,
  ...props
}: {
  value: string;
  code: string;
  children?: ReactNode;
} & Omit<React.ComponentProps<typeof TabsContent>, "value">) {
  const { registerCode } = useCode();

  // code を登録
  useEffect(() => {
    registerCode(value, code);
  }, [value, code, registerCode]);

  return (
    <TabsContent
      data-code-block="content"
      data-slot="code-block-content"
      value={value}
      className={cn(className)}
      {...props}
    >
      {children}
    </TabsContent>
  );
}

function CodeCopyButton({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "onClick">) {
  const { currentValue, codeMap } = useCode();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const code = codeMap.get(currentValue);
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
  }, [currentValue, codeMap]);

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

function CodeGroupSelector({
  children,
  ...props
}: {
  children?: ReactNode;
} & Omit<
  React.ComponentProps<typeof Select>,
  "value" | "onValueChange" | "children"
>) {
  const { setActiveGroups } = useCodeGroup();
  const { currentGroup, groups } = useCode();

  const handleValueChange = useCallback(
    (value: string) => {
      setActiveGroups((values) => {
        const cleanItems = values.filter((v) => !groups.includes(v));
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
        className="[&_span]:truncate [&_span]:max-w-20"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        data-code-block="group-selector-content"
        data-slot="code-block-group-selector-content"
        className="max-w-40"
        align="end"
      >
        {children}
      </SelectContent>
    </Select>
  );
}

function CodeGroupOption({
  value,
  children,
  className,
  ...props
}: {
  value: string;
  children?: ReactNode;
} & React.ComponentProps<typeof SelectItem>) {
  return (
    <SelectItem
      value={value}
      className={cn("[&_span]:truncate", className)}
      {...props}
    >
      <span className="flex items-center gap-2">{children}</span>
    </SelectItem>
  );
}

export {
  CodeProvider,
  Codes,
  CodeHeader,
  CodeList,
  CodeTrigger,
  CodeContent,
  CodeDisplay,
  CodeCopyButton,
  CodeGroupSelector,
  CodeGroupOption,
  useCode,
  useCodeGroup,
};
