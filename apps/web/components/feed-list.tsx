"use client";

import { FeedItem } from "@/lib/feed";
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
import {
  SiGithub,
  SiNextdotjs,
  SiReact,
  SiResend,
  SiBetterauth,
  SiTurso,
} from "@icons-pack/react-simple-icons";
import { ArrowUpRight, Newspaper } from "lucide-react";

const categoryIconsMap: Record<string, React.ElementType> = {
  リリース: SiGithub,
  ニュース: Newspaper,
};

const serviceIconsMap: Record<string, React.ElementType> = {
  "Next.js": SiNextdotjs,
  React: SiReact,
  Resend: SiResend,
  "Better Auth": SiBetterauth,
  Turso: SiTurso,
};

export function FeedList({ feedItems }: { feedItems: FeedItem[] }) {
  const [categories, setCategories] = useQueryState("category");
  const [sources, setSources] = useQueryState("source");

  const filteredFeedItems = useMemo(() => {
    return feedItems.filter((item) => {
      let match = true;

      if (categories && categories?.length > 0) {
        match = categories.includes(item.category);
      }

      if (sources && sources?.length > 0) {
        match = sources.includes(item.source);
      }

      return match;
    });
  }, [feedItems, categories, sources]);

  return (
    <div className="space-y-4">
      {filteredFeedItems.map((item, index) => (
        <Card key={`${item.url}-${index}`}>
          <CardHeader className="flex-1">
            <div className="flex items-center gap-2">
              <IconBadge category={item.category} />
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

function IconBadge({ category }: { category: string }) {
  const Icon = categoryIconsMap[category];

  return (
    <Badge variant="outline">
      {Icon && <Icon className="size-4" />}
      {category}
    </Badge>
  );
}

function ServiceIcon({ service }: { service: string }) {
  const Icon = serviceIconsMap[service];

  if (!Icon) {
    return null;
  }

  return <Icon />;
}
