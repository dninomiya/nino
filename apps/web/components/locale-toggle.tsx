"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Languages } from "lucide-react";
import { Locale, useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";

export default function LocaleToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("LocaleSwitcher");

  const handleChange = (nextLocale: Locale) => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale }
      );
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" disabled={isPending} size="icon">
          <Languages />
          <span className="sr-only">
            {t("locale", { locale: currentLocale })}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={currentLocale}
          onValueChange={(value) => handleChange(value as Locale)}
        >
          {routing.locales.map((locale) => (
            <DropdownMenuRadioItem key={locale} value={locale}>
              {t("locale", { locale })}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
