"use client";

import { Button } from "@workspace/ui/components/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";

export function CopyButon({
  value,
  children,
}: {
  value: string;
  children?: React.ReactNode;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const baseClass = "size-4 text-muted-foreground transition duration-300";

  if (children) {
    return (
      <Button variant="outline" onClick={handleCopy} className="relative">
        <Copy className={cn(baseClass, isCopied && "opacity-0 scale-50")} />
        <Check
          className={cn(
            baseClass,
            "absolute left-3",
            !isCopied && "opacity-0 scale-50"
          )}
        />
        {children}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleCopy}
      className="relative"
      size="icon"
    >
      <Copy className={cn(baseClass, isCopied && "opacity-0 scale-50")} />
      <Check className={cn(baseClass, !isCopied && "opacity-0 scale-50")} />
      <span className="sr-only">Copy</span>
    </Button>
  );
}
