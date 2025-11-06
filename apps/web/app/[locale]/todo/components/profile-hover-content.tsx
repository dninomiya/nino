import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HoverCardContent } from "@/components/ui/hover-card";
import { SiGithub, SiX } from "@icons-pack/react-simple-icons";
import { Profile } from "@workspace/db";
import { Link as LinkIcon } from "lucide-react";
import { ComponentType } from "react";
import { EditTodoProfileButton } from "./edit-todo-profile-button";

interface ProfileHoverContentProps {
  profile: Profile;
  fallbackInitial: string;
  isOwn: boolean;
}

// URLから適切なアイコンを取得する関数
function getIconForUrl(url: string): ComponentType<{ className?: string }> {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // ドメインに応じてアイコンを返す
    if (hostname.includes("x.com") || hostname.includes("twitter.com")) {
      return SiX;
    }
    if (hostname.includes("github.com")) {
      return SiGithub;
    }

    // 該当するアイコンがない場合はlucideのリンクアイコンを使用
    return LinkIcon;
  } catch {
    // URLが無効な場合もリンクアイコンを使用
    return LinkIcon;
  }
}

export function ProfileHoverContent({
  profile,
  isOwn,
  fallbackInitial,
}: ProfileHoverContentProps) {
  // linksをJSONから配列に変換
  const linksArray: string[] =
    profile?.links && profile.links !== null
      ? (JSON.parse(profile.links) as string[])
      : [];

  return (
    <HoverCardContent align="start" className="space-y-3">
      <div className="flex items-center gap-2">
        <Avatar className="rounded-md border border-black/10 size-9">
          {profile.avatar && <AvatarImage src={profile.avatar} />}
          <AvatarFallback>{fallbackInitial}</AvatarFallback>
        </Avatar>
        <div className="space-y-1.5 *:leading-none">
          <h2 className="font-bold text-sm text-zinc-700">
            {profile.nickname}
          </h2>
          <p className="text-xs text-muted-foreground">
            {profile.tagline || "ポートフォリオ作成中"}
          </p>
        </div>
      </div>
      {linksArray.length > 0 && (
        <div className="flex gap-1 text-muted-foreground">
          {linksArray.map((link, index) => {
            const Icon = getIconForUrl(link);
            return (
              <Button
                key={index}
                variant="ghost"
                className="size-6"
                size="icon"
                asChild
              >
                <a href={link} target="_blank" rel="noopener noreferrer">
                  <Icon className="size-4" />
                </a>
              </Button>
            );
          })}
        </div>
      )}
      {isOwn && <EditTodoProfileButton />}
    </HoverCardContent>
  );
}
