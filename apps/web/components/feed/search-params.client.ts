"use client";

import { parseAsArrayOf, parseAsString } from "nuqs";

export const feedSearchParamParsers = {
  type: parseAsArrayOf(parseAsString).withDefault([]),
  source: parseAsArrayOf(parseAsString).withDefault([]),
  tags: parseAsArrayOf(parseAsString).withDefault([]),
};
