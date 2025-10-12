"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { CodeGroupProvider } from "@/components/code-block";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <CodeGroupProvider>{children}</CodeGroupProvider>
    </NextThemesProvider>
  );
}
