export const revalidate = 14400; // 4 hours

import { RecencyDate } from "@/components/recency-date";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getFeedItems } from "@/lib/feed";
import { mockFeedItems } from "@/mock/feed";
import {
  SiGithub,
  SiNextdotjs,
  SiReact,
  SiResend,
  SiBetterauth,
  SiTurso,
} from "@icons-pack/react-simple-icons";
import { ArrowUpRight, Newspaper } from "lucide-react";

const isDevelopment = process.env.NODE_ENV === "development";

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

export default async function Page() {
  const feedItems = isDevelopment ? mockFeedItems : await getFeedItems(7);

  return (
    <div className="container mx-auto p-8">
      {/* <textarea value={JSON.stringify(feedItems, null, 2)} /> */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">過去7日間の更新</h1>
        <p className="text-sm text-muted-foreground mb-4">
          最終更新: <RecencyDate date={Date.now()} />
        </p>
      </div>

      {feedItems.length === 0 ? (
        <p className="text-muted-foreground">更新情報はありません</p>
      ) : (
        <div className="space-y-4">
          {feedItems.map((item, index) => (
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
                  <a
                    href={item.url}
                    target="_blank"
                    className="hover:underline"
                  >
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
      )}
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
