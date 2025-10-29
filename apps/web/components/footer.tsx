import { getMessage } from "@/lib/i18n/server";
import {
  SiDiscord,
  SiGithub,
  SiX,
  SiYoutube,
  SiZenn,
} from "@icons-pack/react-simple-icons";
import {
  AUTHOR_DISCORD_URL,
  AUTHOR_GITHUB_URL,
  AUTHOR_X_URL,
  AUTHOR_YOUTUBE_URL,
  AUTHOR_ZENN_URL,
} from "@workspace/lib/constants";
import { Logo } from "@workspace/ui/blocks/logo/logo";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { Copyright } from "./copyright";

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

const footerLinks = [
  {
    titleKey: "linksTitle",
    links: [
      {
        href: "/",
        labelKey: "feed",
      },
      {
        href: "/status",
        labelKey: "status",
      },
      {
        href: "/docs",
        labelKey: "docs",
      },
      {
        href: "/registry",
        labelKey: "registry",
      },
      {
        href: "/architecture",
        labelKey: "architecture",
      },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="py-10 px-4 lg:px-8 border-t">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="text-sm text-muted-foreground">Developer</p>
          <div className="flex gap-2 text-muted-foreground">
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
      </div>

      <FooterNavs />

      <Copyright />
    </footer>
  );
};

async function FooterNavs() {
  const t = await getMessage("Footer");

  return (
    <>
      {footerLinks.map((link) => (
        <ul key={link.titleKey}>
          <h4 className="text-lg mb-2 px-3 font-bold">
            {t[link.titleKey as keyof typeof t]}
          </h4>
          {link.links.map((link) => (
            <li key={link.href}>
              <Button variant="link" size="sm" asChild>
                <Link href={link.href}>
                  {t[link.labelKey as keyof typeof t]}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      ))}
    </>
  );
}
