import { SiGithub, SiYoutube } from "@icons-pack/react-simple-icons";
import { LucideIcon, Newspaper } from "lucide-react";
import { collections } from "./configs";

// フィードタイプのマッピング（ラベルとアイコンを一元化）
export const feedTypeMapping = {
  releases: {
    icon: SiGithub,
  },
  blog: {
    icon: Newspaper,
  },
  changelog: {
    icon: Newspaper,
  },
  youtube: {
    icon: SiYoutube,
  },
} as const;

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
