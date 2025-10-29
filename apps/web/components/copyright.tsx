"use client";

import { APP_NAME } from "@workspace/lib/constants";
import { useMessage } from "./i18n-provider";

export const Copyright = () => {
  const t = useMessage("Footer");

  return (
    <p className="text-sm text-muted-foreground mt-10">
      &copy; {new Date().getFullYear()} {APP_NAME}. {t.copyright}
    </p>
  );
};
