import { YouTubeVideo } from "@/registry/blocks/youtube-video";
import { ReactNode } from "react";
import { GitHubRepo } from "./github-repo";

interface MDXParagraphProps {
  children: ReactNode;
  [key: string]: any;
}

// YouTube URLのパターンを検出する関数
function isYouTubeURL(text: string): boolean {
  const youtubePatterns = [
    /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]+/,
    /^https:\/\/youtu\.be\/[\w-]+/,
  ];

  return youtubePatterns.some((pattern) => pattern.test(text.trim()));
}

function isGitHubURL(text: string): boolean {
  const githubPatterns = [/^https:\/\/github\.com\/[\w-]+\/[\w-]+/];
  return githubPatterns.some((pattern) => pattern.test(text.trim()));
}

// テキストからYouTube URLを抽出する関数
function extractYouTubeURL(text: string): string | null {
  const youtubePatterns = [
    /https:\/\/www\.youtube\.com\/watch\?v=[\w-]+[^\s]*/,
    /https:\/\/youtu\.be\/[\w-]+[^\s]*/,
  ];

  for (const pattern of youtubePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return null;
}

// テキストからGitHub URLを抽出する関数
function extractGitHubURL(text: string): string | null {
  const githubPatterns = [/https:\/\/github\.com\/[\w-]+\/[\w-]+[^\s]*/];

  for (const pattern of githubPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return null;
}

// React要素を再帰的にチェックしてYouTube URLを検出する関数
function findYouTubeURL(children: ReactNode): string | null {
  if (typeof children === "string") {
    const trimmedText = children.trim();
    if (isYouTubeURL(trimmedText)) {
      return extractYouTubeURL(trimmedText);
    }
  } else if (Array.isArray(children)) {
    for (const child of children) {
      const url = findYouTubeURL(child);
      if (url) return url;
    }
  } else if (children && typeof children === "object" && "props" in children) {
    return findYouTubeURL((children as any).props.children);
  }

  return null;
}

// React要素を再帰的にチェックしてGitHub URLを検出する関数
function findGitHubURL(children: ReactNode): string | null {
  if (typeof children === "string") {
    const trimmedText = children.trim();
    if (isGitHubURL(trimmedText)) {
      return extractGitHubURL(trimmedText);
    }
  } else if (Array.isArray(children)) {
    for (const child of children) {
      const url = findGitHubURL(child);
      if (url) return url;
    }
  } else if (children && typeof children === "object" && "props" in children) {
    return findGitHubURL((children as any).props.children);
  }

  return null;
}

export function MDXParagraph({ children, ...props }: MDXParagraphProps) {
  // childrenを再帰的にチェックしてYouTube URLを検出
  const youtubeURL = findYouTubeURL(children);

  if (youtubeURL) {
    return <YouTubeVideo videoid={youtubeURL.split("v=")[1]!} />;
  }

  // childrenを再帰的にチェックしてGitHub URLを検出
  const githubURL = findGitHubURL(children);
  if (githubURL) {
    return <GitHubRepo url={githubURL} />;
  }

  // 通常の段落として表示
  return <p {...props}>{children}</p>;
}
