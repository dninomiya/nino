"use client";

import { useState } from "react";

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
import { YouTubeVideo } from "@/registry/components/youtube-video";
import type { FeedItem, FeedType } from "@/lib/feed";
import { feedTypeMapping, techMapping } from "@/lib/feed";
import { Locale } from "@/lib/i18n/locale";
import { ArrowUpRight, Rss } from "lucide-react";

import { getFeedTypeLabel, getTagLabel } from "./helpers";

type LabelDictionary = Record<string, string>;

type FeedListItemProps = {
  item: FeedItem;
  locale: Locale;
  index: number;
  tagMessages: LabelDictionary;
  feedTypeMessages: LabelDictionary;
};

export function FeedListItem({
  item,
  locale,
  index,
  tagMessages,
  feedTypeMessages,
}: FeedListItemProps) {
  const [expanded, setExpanded] = useState(false);
  const isYouTube = item.type === "youtube";
  const youTubeVideoId = isYouTube ? extractYouTubeVideoId(item.url) : null;

  const fallbackImage =
    item.thumbnail && item.thumbnail.trim() !== "" ? (
      <img
        src={item.thumbnail}
        alt={item.title}
        className="w-full rounded-md border"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    ) : null;

  const mediaContent = isYouTube ? (
    youTubeVideoId ? (
      <YouTubeVideo
        key={`youtube-${youTubeVideoId}-${index}`}
        videoid={youTubeVideoId}
      />
    ) : (
      fallbackImage
    )
  ) : (
    fallbackImage
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 flex-wrap">
          <IconBadge type={item.type} feedTypeMessages={feedTypeMessages} />
          <Badge variant="outline">
            <ServiceIcon service={item.source} />
            {item.source}
          </Badge>
          {item.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {getTagLabel(tag, tagMessages)}
            </Badge>
          ))}
        </div>

        <CardTitle>
          <a
            href={item.url}
            target="_blank"
            className="hover:underline leading-relaxed"
            rel="noreferrer"
          >
            {item.title}
            <ArrowUpRight className="size-4 align-baseline ml-1 inline text-muted-foreground" />
          </a>
        </CardTitle>
        <CardDescription>
          <RecencyDate date={item.date} locale={locale} />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {item.type !== "releases" && <>{mediaContent}</>}

        {item.summary && (
          <div className="leading-relaxed">
            <p>{item.summary}</p>
            {item.rawXml && (
              <Collapsible open={expanded} onOpenChange={setExpanded}>
                <CollapsibleTrigger asChild>
                  <Button variant="link" size="sm" className="mt-1">
                    {expanded ? "閉じる" : "原文をみる"}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="bg-muted p-3 rounded-md">
                    <pre className="text-xs overflow-auto max-h-96 whitespace-pre-wrap">
                      {formatRawContent(item.rawXml, item)}
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
  );
}

function IconBadge({
  type,
  feedTypeMessages,
}: {
  type: FeedType;
  feedTypeMessages: LabelDictionary;
}) {
  const mapping = feedTypeMapping[type];
  const Icon = mapping.icon;

  return (
    <Badge variant="outline">
      {Icon && <Icon className="size-4" />}
      {getFeedTypeLabel(type, feedTypeMessages)}
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

function formatRawContent(raw: string, item: FeedItem) {
  try {
    const parsed = JSON.parse(raw || "{}");
    const title = parsed.title || item.title;
    const content =
      parsed.contentSnippet || parsed.description || parsed.content || "";

    return `${title}\n\n${content}`.trim();
  } catch {
    return raw || "";
  }
}

const YOUTUBE_VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;
const YOUTUBE_PATH_SEGMENTS = ["embed", "shorts", "live", "v", "clip"];

function extractYouTubeVideoId(input: string): string | null {
  const trimmed: string = input.trim();

  if (!trimmed) {
    return null;
  }

  if (isValidYouTubeId(trimmed)) {
    return trimmed;
  }

  try {
    const sanitized = trimmed as string;
    const hasProtocol = /^(?:https?:)?\/\//i.test(sanitized);
    let normalizedUrl: string;

    if (hasProtocol) {
      const isProtocolRelative =
        sanitized.length >= 2 && sanitized[0] === "/" && sanitized[1] === "/";
      normalizedUrl = isProtocolRelative
        ? `https://${sanitized.slice(2)}`
        : sanitized;
    } else {
      normalizedUrl = `https://${sanitized}`;
    }
    const url = new URL(normalizedUrl);
    const hostname = url.hostname.replace(/^www\./, "").toLowerCase();
    const pathSegments = url.pathname.split("/").filter(Boolean);

    if (hostname === "youtu.be") {
      const candidate = pathSegments[0];
      return isValidYouTubeId(candidate) ? candidate : null;
    }

    if (hostname.endsWith("youtube.com")) {
      const vParam = url.searchParams.get("v");
      if (isValidYouTubeId(vParam)) {
        return vParam!;
      }

      for (const segment of YOUTUBE_PATH_SEGMENTS) {
        const index = pathSegments.indexOf(segment);
        if (index !== -1) {
          const candidate = pathSegments[index + 1];
          if (isValidYouTubeId(candidate)) {
            return candidate;
          }
        }
      }

      if (pathSegments.length) {
        const lastSegment = pathSegments[pathSegments.length - 1];
        if (isValidYouTubeId(lastSegment)) {
          return lastSegment;
        }
      }
    }
  } catch {
    // ignore URL parsing errors
  }

  return null;
}

function isValidYouTubeId(value: string | null | undefined): value is string {
  return !!value && YOUTUBE_VIDEO_ID_PATTERN.test(value);
}
