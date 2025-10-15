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
import { YouTubeVideo } from "@/components/youtube-video";
import { FeedItem, getCollectionByName, typeLabels } from "@/lib/feed";
import { SiGithub, SiYoutube } from "@icons-pack/react-simple-icons";
import { ArrowUpRight, FileText, Newspaper, Rss } from "lucide-react";
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

      return match;
    });
  }, [feedItems, types, sources]);

  return (
    <div className="space-y-4">
      {filteredFeedItems.map((item, index) => (
        <Card key={`${item.url}-${index}`}>
          <CardHeader className="flex-1">
            <div className="flex items-center gap-2">
              <IconBadge type={item.type} />
              <Badge variant="outline">
                <ServiceIcon service={item.source} />
                {item.source}
              </Badge>
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
          <CardContent>
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
              <p className="text-sm text-muted-foreground">{item.summary}</p>
            )}
          </CardContent>

          <CardFooter className="flex gap-2">
            {/* RSSフィードへのリンク */}
            {item.rssUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(item.rssUrl, "_blank")}
                className="flex items-center gap-2"
              >
                <Rss className="size-4" />
                RSS
              </Button>
            )}

            {/* 原文表示の開閉ボタン */}
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <FileText className="size-4" />
                    {expandedItems.has(index) ? "閉じる" : "原文"}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="bg-muted p-3 rounded-md">
                    <pre className="text-xs overflow-auto max-h-96 whitespace-pre-wrap">
                      {JSON.stringify(item, null, 2)}
                    </pre>
                  </div>
                </CollapsibleContent>
              </Collapsible>
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
