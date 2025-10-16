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
  getCollectionByName,
  TAG_LABELS,
  typeLabels,
} from "@/lib/feed";
import { SiGithub, SiYoutube } from "@icons-pack/react-simple-icons";
import { ArrowUpRight, Newspaper, Rss, SearchX } from "lucide-react";
import { useQueryState } from "nuqs";
import { useMemo, useState } from "react";

const typeIconsMap: Record<string, React.ElementType> = {
  リリース: SiGithub,
  ニュース: Newspaper,
  変更履歴: Newspaper,
  動画: SiYoutube,
};

export function FeedList({ feedItems }: { feedItems: FeedItem[] }) {
  const [types] = useQueryState("type");
  const [sources] = useQueryState("source");
  const [tags] = useQueryState("tags");
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const filteredFeedItems = useMemo(() => {
    return feedItems.filter((item) => {
      let match = true;

      if (types && types?.length > 0) {
        // 英語→日本語マッピングを考慮
        const itemTypeInJapanese = typeLabels[item.type];
        match = itemTypeInJapanese ? types.includes(itemTypeInJapanese) : false;
      }

      if (sources && sources?.length > 0) {
        match = sources.includes(item.source);
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
                  {TAG_LABELS[tag] || tag}
                </Badge>
              ))}
            </div>

            <CardTitle>
              <a href={item.url} target="_blank" className="hover:underline">
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

function IconBadge({ type }: { type: string }) {
  const Icon = typeIconsMap[type];
  const displayType = typeLabels[type] || type;

  return (
    <Badge variant="outline">
      {Icon && <Icon className="size-4" />}
      {displayType}
    </Badge>
  );
}

function ServiceIcon({ service }: { service: string }) {
  const collection = getCollectionByName(service);

  if (!collection) {
    return null;
  }

  const Icon = collection.icon;
  return <Icon className="size-4" />;
}
