import { NextRequest } from "next/server";
import { handleLocaleRouting } from "./lib/i18n/routing";

export default function proxy(request: NextRequest) {
  return handleLocaleRouting(request);
}

export const config = {
  matcher:
    "/((?!api|monitoring|trpc|_next|_vercel|rss/|llms\\.txt|r/|.*\\..*).*)",
};
