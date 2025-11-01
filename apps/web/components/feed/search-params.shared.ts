export type FeedSearchParamsState = {
  type: string[];
  source: string[];
  tags: string[];
};

export const defaultFeedSearchParams: FeedSearchParamsState = {
  type: [],
  source: [],
  tags: [],
};

