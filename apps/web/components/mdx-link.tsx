import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface MDXLinkProps {
  href?: string;
  children: ReactNode;
  [key: string]: any;
}

export function MDXLink({ href, children, ...props }: MDXLinkProps) {
  // hrefが存在しない場合は通常のリンクとして処理
  if (!href) {
    return <a {...props}>{children}</a>;
  }

  // 外部リンクかどうかを判定
  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="print:no-underline"
        {...props}
      >
        {children}
        <ArrowUpRight className="size-3 inline text-muted-foreground print:hidden" />
      </a>
    );
  }

  if (children === "DEMO") {
    return (
      <Button className="not-prose" asChild>
        <a href={href} target="_blank">
          ライブデモ
          <ArrowUpRight className="size-3 inline text-muted-foreground" />
        </a>
      </Button>
    );
  }

  // 内部リンクの場合はNext.jsのLinkコンポーネントを使用
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}
