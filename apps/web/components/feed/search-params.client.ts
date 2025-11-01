"use client";

import { parseAsArrayOf, parseAsString } from "nuqs";

export const feedSearchParamParsers = {
  type: parseAsArrayOf(parseAsString).withDefault<string[]>([]),
  source: parseAsArrayOf(parseAsString).withDefault<string[]>([]),
  tags: parseAsArrayOf(parseAsString).withDefault<string[]>([]),
};

