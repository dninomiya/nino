"use client";

import { Button } from "@workspace/ui/components/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";

export const CopyButton = ({ value }: { value: string }) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  const baseClass =
    "size-4 text-muted-foreground absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transition duration-500";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      className="relative"
    >
      <Copy className={cn(baseClass, isCopied && "opacity-0 scale-50")} />
      <Check className={cn(baseClass, !isCopied && "opacity-0 scale-50")} />
      <span className="sr-only">コードをコピー</span>
    </Button>
  );
};
