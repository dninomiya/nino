"use client";

import { FeedItem, getCollectionByName, typeLabels } from "@/lib/feed";
import { useQueryState } from "nuqs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { RecencyDate } from "@/components/recency-date";
import { SiGithub, SiYoutube } from "@icons-pack/react-simple-icons";
import { ArrowUpRight, Newspaper } from "lucide-react";

const typeIconsMap: Record<string, React.ElementType> = {
  リリース: SiGithub,
  ニュース: Newspaper,
  変更履歴: Newspaper,
  動画: SiYoutube,
};

export function FeedList({ feedItems }: { feedItems: FeedItem[] }) {
  const [types, setTypes] = useQueryState("type");
  const [sources, setSources] = useQueryState("source");

  const filteredFeedItems = useMemo(() => {
    return feedItems.filter((item) => {
      let match = true;

      if (types && types?.length > 0) {
        match = types.includes(item.type);
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
