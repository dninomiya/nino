import "server-only";

import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsString,
  type SearchParams,
} from "nuqs/server";

import {
  defaultFeedSearchParams,
  type FeedSearchParamsState,
} from "./search-params.shared";

export const feedSearchParamParsers = {
  type: parseAsArrayOf(parseAsString).withDefault<string[]>([]),
  source: parseAsArrayOf(parseAsString).withDefault<string[]>([]),
  tags: parseAsArrayOf(parseAsString).withDefault<string[]>([]),
};

export const feedSearchParamsCache = createSearchParamsCache(
  feedSearchParamParsers
);

export type FeedSearchParams = FeedSearchParamsState;

export type FeedSearchParamsInput = Parameters<
  typeof feedSearchParamsCache.parse
>[0];

export async function parseFeedSearchParams(
  searchParams?: FeedSearchParamsInput,
  options?: Parameters<typeof feedSearchParamsCache.parse>[1]
): Promise<FeedSearchParams> {
  if (!searchParams) {
    return defaultFeedSearchParams;
  }

  return feedSearchParamsCache.parse(searchParams, options);
}

export { defaultFeedSearchParams } from "./search-params.shared";
export type { SearchParams };

