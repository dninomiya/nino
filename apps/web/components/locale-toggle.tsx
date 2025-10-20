"use client";

import { Locale, locales } from "@/lib/i18n/locale";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Languages } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMessage, useI18n } from "./i18n-provider";

export default function LocaleToggle() {
  const pathname = usePathname();
  const { locale } = useI18n();
  const t = useMessage("Langulage");

  const handleChange = (nextLocale: Locale) => {
    location.href = `/${nextLocale}${pathname}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages />
          <span className="sr-only">{locale === "ja" ? t.ja : t.en}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(value) => handleChange(value as Locale)}
        >
          {locales.map((locale) => (
            <DropdownMenuRadioItem key={locale} value={locale}>
              {t[locale]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
