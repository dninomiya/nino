"use client";

import { RecencyDate } from "@/components/recency-date";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@workspace/ui/components/empty";
import { YouTubeVideo } from "@/components/youtube-video";
import {
  FeedItem,
  FeedType,
  getCollectionByName,
  feedTypeMapping,
  techMapping,
} from "@/lib/feed";
import { ArrowUpRight, Rss, SearchX } from "lucide-react";
import { useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { useDictionary } from "./i18n-provider";

// タグ名を翻訳する関数
const getTagLabel = (tag: string, tTags: any) => {
  const tagMap: Record<string, string> = {
    feature: tTags.feature,
    event: tTags.event,
    bugfix: tTags.bugfix,
    "big-news": tTags.bigNews,
    release: tTags.release,
    update: tTags.update,
    announcement: tTags.announcement,
    tutorial: tTags.tutorial,
    documentation: tTags.documentation,
    security: tTags.security,
    performance: tTags.performance,
    "breaking-change": tTags.breakingChange,
  };
  return tagMap[tag] || tag;
};

export function FeedList({ feedItems }: { feedItems: FeedItem[] }) {
  const [types] = useQueryState("type");
  const [sources] = useQueryState("source");
  const [tags] = useQueryState("tags");
  const tTags = useDictionary("Tags");
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const filteredFeedItems = useMemo(() => {
    return feedItems.filter((item) => {
      let match = true;

      if (types && types?.length > 0) {
        // 直接英語値で比較
        match = types.includes(item.type);
      }

      if (sources && sources?.length > 0) {
        match = match && sources.includes(item.source);
      }

      if (tags && tags?.length > 0 && item.tags) {
        // タグフィルタリング
        const hasMatchingTag = item.tags.some((tag) => tags.includes(tag));
        match = match && hasMatchingTag;
      }

      return match;
    });
  }, [feedItems, types, sources, tags]);

  if (filteredFeedItems.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX />
          </EmptyMedia>
          <EmptyTitle>該当する結果が見つかりません</EmptyTitle>
          <EmptyDescription>
            現在のフィルター条件に一致するフィードアイテムがありません。フィルターを調整して再度お試しください。
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="space-y-4">
      {filteredFeedItems.map((item, index) => (
        <Card key={`${item.url}-${index}`}>
          <CardHeader>
            <div className="flex items-center gap-2 flex-wrap">
              <IconBadge type={item.type} />
              <Badge variant="outline">
                <ServiceIcon service={item.source} />
                {item.source}
              </Badge>
              {item.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {getTagLabel(tag, tTags)}
                </Badge>
              ))}
            </div>

            <CardTitle>
              <a
                href={item.url}
                target="_blank"
                className="hover:underline leading-relaxed"
              >
                {item.title}
                <ArrowUpRight className="size-4 align-baseline ml-1 inline text-muted-foreground" />
              </a>
            </CardTitle>
            <CardDescription>
              <RecencyDate date={item.date} />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {item.type !== "releases" && (
              <>
                {item.type === "youtube" ? (
                  <YouTubeVideo
                    url={item.url}
                    title={item.title}
                    thumbnail={item.thumbnail}
                  />
                ) : item.thumbnail && item.thumbnail.trim() !== "" ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full rounded-md"
                    onError={(e) => {
                      // 画像読み込みエラー時は非表示にする
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : null}
              </>
            )}

            {item.summary && (
              <div className="leading-relaxed">
                <p>{item.summary}</p>
                {item.rawXml && (
                  <Collapsible
                    open={expandedItems.has(index)}
                    onOpenChange={(open) => {
                      const newExpanded = new Set(expandedItems);
                      if (open) {
                        newExpanded.add(index);
                      } else {
                        newExpanded.delete(index);
                      }
                      setExpandedItems(newExpanded);
                    }}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="link" size="sm" className="mt-1">
                        {expandedItems.has(index) ? "閉じる" : "原文をみる"}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="bg-muted p-3 rounded-md">
                        <pre className="text-xs overflow-auto max-h-96 whitespace-pre-wrap">
                          {(() => {
                            try {
                              const rawData = JSON.parse(item.rawXml || "{}");
                              return `${rawData.title || item.title}\n\n${rawData.contentSnippet || rawData.description || ""}`;
                            } catch {
                              return item.rawXml || "";
                            }
                          })()}
                        </pre>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex gap-2 flex-wrap">
            {item.rssUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={item.rssUrl} target="_blank">
                  <Rss className="size-4" />
                  RSS
                </a>
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function IconBadge({ type }: { type: FeedType }) {
  const mapping = feedTypeMapping[type];
  const Icon = mapping.icon;

  return (
    <Badge variant="outline">
      {Icon && <Icon className="size-4" />}
      {mapping.label}
    </Badge>
  );
}

function ServiceIcon({ service }: { service: string }) {
  const mapping = techMapping[service];

  if (!mapping) {
    return null;
  }

  const Icon = mapping.icon;
  return <Icon className="size-4" />;
}
