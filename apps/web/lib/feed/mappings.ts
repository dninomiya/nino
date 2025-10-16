import { SiGithub, SiYoutube } from "@icons-pack/react-simple-icons";
import { LucideIcon, Newspaper } from "lucide-react";
import { collections } from "./configs";

// フィードタイプのマッピング（ラベルとアイコンを一元化）
export const feedTypeMapping = {
  releases: {
    label: "リリース",
    icon: SiGithub,
  },
  blog: {
    label: "ニュース",
    icon: Newspaper,
  },
  changelog: {
    label: "変更履歴",
    icon: Newspaper,
  },
  youtube: {
    label: "YouTube",
    icon: SiYoutube,
  },
} as const;

// タグの日本語ラベルマップ
export const TAG_LABELS: Record<string, string> = {
  feature: "機能追加",
  event: "イベント",
  bugfix: "バグ修正",
  "big-news": "ビッグニュース",
  release: "リリース",
  update: "アップデート",
  announcement: "お知らせ",
  tutorial: "チュートリアル",
  documentation: "ドキュメント",
  security: "セキュリティ",
  performance: "パフォーマンス",
  "breaking-change": "破壊的変更",
};

// カテゴリの表示順序
export const categoryOrder = [
  "フレームワーク",
  "ライブラリ",
  "ツール",
  "SaaS/BaaS",
  "AI",
  "モバイル",
];

// 技術のマッピング（ラベルとアイコンを一元化）
export const techMapping = collections.reduce(
  (acc, collection) => {
    acc[collection.name] = {
      label: collection.name,
      icon: collection.icon,
      category: collection.category,
    };
    return acc;
  },
  {} as Record<string, { label: string; icon: LucideIcon; category: string }>
);
