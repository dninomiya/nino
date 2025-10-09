import { Logo } from "@workspace/ui/blocks/logo/logo";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import {
  SiX,
  SiZenn,
  SiGithub,
  SiYoutube,
  SiDiscord,
} from "@icons-pack/react-simple-icons";
import {
  AUTHOR_X_URL,
  AUTHOR_ZENN_URL,
  AUTHOR_YOUTUBE_URL,
  AUTHOR_GITHUB_URL,
  APP_NAME,
  AUTHOR_DISCORD_URL,
} from "@workspace/lib/constants";

const authorLinks = [
  {
    icon: SiX,
    href: AUTHOR_X_URL,
    label: "X",
  },
  {
    icon: SiGithub,
    href: AUTHOR_GITHUB_URL,
    label: "GitHub",
  },
  {
    icon: SiYoutube,
    href: AUTHOR_YOUTUBE_URL,
    label: "YouTube",
  },
  {
    icon: SiZenn,
    href: AUTHOR_ZENN_URL,
    label: "Zenn",
  },
  {
    icon: SiDiscord,
    href: AUTHOR_DISCORD_URL,
    label: "Discord",
  },
];

export const Footer = () => {
  return (
    <footer className="py-10 lg:px-8 border-t">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="text-sm text-muted-foreground">Web Developer.</p>
          <div className="flex gap-2">
            {authorLinks.map((link) => (
              <Button variant="ghost" asChild size="icon" key={link.label}>
                <Link href={link.href} target="_blank">
                  <link.icon />
                  <span className="sr-only">{link.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold">Links</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/">Home</Link>
            </li>
          </ul>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mt-10">
        &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </p>
    </footer>
  );
};
